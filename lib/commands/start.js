const Command          = require('./-command');
const Hook             = require('../tasks/run-hook');
const logger           = require('../utils/logger');
const CordovaTarget    = require('../targets/cordova/target');
const CordovaRaw       = require('../targets/cordova/tasks/raw');
const editXml          = require('../targets/cordova/utils/edit-xml');
const getNetworkIp     = require('../utils/get-network-ip');
const requireFramework = require('../utils/require-framework');
const RSVP             = require('rsvp');
const Promise          = RSVP.Promise;
const flatten          = require('lodash').flatten;

const listAndroidEms   = require('../targets/android/tasks/list-emulators');
const AndroidTarget    = require('../targets/android/target');
const listIOSEms       = require('../targets/ios/tasks/list-emulators');
const IOSTarget        = require('../targets/ios/target');

const CreateLiveReloadShell = require('../tasks/create-livereload-shell');

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

  selectEmulator(opts) {
    let getEmulators = [];
    if (opts.platform !== 'ios') {
      getEmulators.push(listAndroidEms());
    }

    if (opts.platform !== 'android') {
      getEmulators.push(listIOSEms());
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
    logger.info('Corber Starting');

    return this.selectEmulator(opts).then((emulator) => {
      //supports webpack addon
      this.project.targetIsCordova = true;
      this.project.CORDOVA_PLATFORM = emulator.platform;
      this.project.targetIsCordovaLivereload = true;

      let platformTarget;
      if (emulator.platform === 'ios') {
        platformTarget = new IOSTarget({
          emulator: emulator,
          project: this.project
        });
      } else if (emulator.platform === 'android') {
        platformTarget = new AndroidTarget({
          emulator: emulator,
          project: this.project
        });
      }

      let framework = requireFramework(this.project);
      let reloadUrl = this.getReloadUrl(opts.port, opts.reloadUrl, framework);

      let createLivereloadShell = new CreateLiveReloadShell({
        project: this.project
      });

      let cdvTarget = new CordovaTarget({
        platform: emulator.platform,
        project: this.project
      });

      let prepare = new CordovaRaw({
        project: this.project,
        api: 'prepare'
      });

      let hook = new Hook({
        project: this.project
      });

      return framework.validateServe(opts)
        .then(() => editXml.addNavigation(this.project, reloadUrl))
        .then(() => createLivereloadShell.run(reloadUrl))
        .then(() => prepare.run({ platforms: [emulator.platform] }))
        .then(() => hook.run('beforeBuild'))
        .then(() => cdvTarget.validateServe())
        .then(() => platformTarget.build())
        .then(() => hook.run('afterBuild'))
        .then(() => platformTarget.run())
        .then(() => framework.serve(opts, this.ui));
    });
  }
});
