const Command          = require('./-command');
const Hook             = require('../tasks/run-hook');
const logger           = require('../utils/logger');
const BuildEmulator    = require('../targets/ios/tasks/build-emulator');
const RunEmulator      = require('../targets/ios/tasks/run-emulator');
const IOSEmulators     = require('../targets/ios/tasks/list-emulators');
const AndroidEmulators = require('../targets/android/tasks/list-emulators');
const CordovaRaw       = require('../targets/cordova/tasks/raw');
const cordovaPath      = require('../targets/cordova/utils/get-path');
const cdvConfig        = require('../targets/cordova/utils/get-config');
const editXml          = require('../targets/cordova/utils/edit-xml');
const getNetworkIp     = require('../utils/get-network-ip');
const requireFramework = require('../utils/require-framework');
const path             = require('path');
const RSVP             = require('rsvp');
const Promise          = RSVP.Promise;
const flatten          = require('lodash').flatten;


const CreateLiveReloadShell = require('../tasks/create-livereload-shell');

//TODO - implement static builds /w start
//TODO - validate whitelist plugin

module.exports = Command.extend({
  name: 'start',
  aliases: [ 'start' ],
  description: 'Run app on device/emulator /w livereload',
  works: 'insideProject',

  availableOptions: [
    { name: 'platform',   type: String },
    { name: 'emulator',   type: String,  default: '' },
    { name: 'emulatorid', type: String },
    { name: 'build',      type: Boolean },
    { name: 'reload-url', type: String,  aliases: ['r'] },
    { name: 'port',       type: Number,  aliases: ['p'] }
  ],

  getReloadUrl(port, reloadUrl, framework) {
    if (reloadUrl) { return reloadUrl; }

    if (port === undefined) {
      port = framework.port;
    }

    let networkAddress = getNetworkIp();
    return 'http://' + networkAddress + ':' + port;
  },

  buildAndRun(emulator, opts) {
    logger.info(`Targeting emulator ${emulator.name} id=${emulator.id}`);
    return cdvConfig(this.project).then((config) => {
      let scheme =  config.widget.name[0];
      let appName = config.widget.$.id;

      let corberPath = cordovaPath(this.project, true);
      let iosPath = path.join(corberPath, 'cordova', 'platforms', 'ios');
      let buildPath = path.join(corberPath, 'tmp', 'builds');
      let builtPath = path.join(
        buildPath, 'Build', 'Products',
        'Debug-iphonesimulator', `${scheme}.app`
      );

      let hook = new Hook({
        project: this.project
      });

      let prepare = new CordovaRaw({
        project: this.project,
        api: 'prepare'
      });

      let build = new BuildEmulator();
      let runEmulator = new RunEmulator();

      return hook.run('beforeBuild', opts)
        .then(() => prepare.run({ platforms: [opts.platform]}))
        .then(() => build.run(emulator, buildPath, scheme, iosPath))
        .then(() => hook.run('afterBuild', opts))
        .then(() => runEmulator.run(emulator, appName, builtPath));
    });
  },

  selectEmulator(opts) {
    let getEmulators = [];
    if (opts.platform !== 'ios') {
      getEmulators.push(new AndroidEmulators().run());
    }

    if (opts.platform !== 'android') {
      getEmulators.push(new IOSEmulators().run());
    }

    return RSVP.all(getEmulators).then((emulators) => {
      emulators = flatten(emulators);
      if (opts.emulator === '') {
        let promptOpts = {
          type: 'list',
          name: 'emulator',
          message: 'Select an emulator',
          pageSize: 30,
          choices: []
        };

        emulators.forEach((em, i) => {
          promptOpts.choices.push({
            key: i,
            name: em.label(),
            value: em
          });
        });

        return this.ui.prompt(promptOpts).then((selected) => {
          return selected.emulator;
        });
      } else {
        //Preference --emulator vs emulatorID if passed
        let emulator;
        if (opts.emulator) {
          emulator = emulators.find(function(em) {
            if (em.name === opts.emulator) { return em; }
          });
        } else {
          emulator = emulators.find(function(em) {
            if (em.id === opts.emulatorid) { return em; }
          });
        }

        return Promise.resolve(emulator);
      }
    });
  },

  run(opts) {
    this._super.apply(this, arguments);
    //support for live reload addon service
    this.project.targetIsCordova = true;
    this.project.CORDOVA_PLATFORM = opts.platform;
    if (opts.build !== true) {
      this.project.targetIsCordovaLivereload = true;
    }

    logger.info('Corber Starting');

    return this.selectEmulator(opts).then((selectedEmulator) => {
      let framework = requireFramework(this.project);
      let reloadUrl = this.getReloadUrl(opts.port, opts.reloadUrl, framework);

      let setupLivereload = new CreateLiveReloadShell({
        project: this.project
      });

      return framework.validateServe(opts)
        .then(() => editXml.addNavigation(this.project, reloadUrl))
        .then(() => setupLivereload.run(reloadUrl))
        .then(() => this.buildAndRun(selectedEmulator, opts))
        .then(() => framework.serve(opts, this.ui));
    });
  }
});
