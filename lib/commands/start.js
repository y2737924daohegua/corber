const Command          = require('./-command');
const Hook             = require('../tasks/run-hook');
const logger           = require('../utils/logger');
const BuildEmulator    = require('../targets/ios/tasks/build-emulator');
const RunEmulator      = require('../targets/ios/tasks/run-emulator');
const ListEmulators    = require('../targets/ios/tasks/list-emulators');
const cordovaPath      = require('../targets/cordova/utils/get-path');
const cdvConfig        = require('../targets/cordova/utils/get-config');
const path             = require('path');
const ServeCommand     = require('./serve');

module.exports = Command.extend({
  name: 'start',
  aliases: [ 'start' ],
  description: 'Run app on device/emulator /w livereload',
  works: 'insideProject',

  availableOptions: [
    { name: 'platform',   type: String,  default: 'ios' },
    { name: 'emulator',   type: String },
    { name: 'emulatorid', type: String },
    { name: 'reload-url', type: String,  aliases: ['r'] }
  ],

  buildAndRun(emulator, options) {
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

      let build = new BuildEmulator();
      let runEmulator = new RunEmulator();

      return hook.run('beforeBuild', opts)
        .then(() => build.run(emulator, buildPath, scheme, iosPath))
        .then(() => hook.run('afterBuild', opts))
        .then(() => runEmulator.run(emulator, appName, builtPath))
        .then(() => this.startServer(options));

    });
  },

  startServer(options) {
    //TODO - not this
    let serve = new ServeCommand({
      project: this.project,
      ui: this.ui
    });

    options.skipCordovaBuild = true;
    return serve.run(options);
  },

  run(options) {
    this._super.apply(this, arguments);

    let listEmulators = new ListEmulators();
    logger.info('Corber Starting');

    return listEmulators.run().then((emulators) => {
      if (options.emulator === '') {
        let promptOptions = {
          type: 'list',
          name: 'emulator',
          message: 'Select an emulator',
          pageSize: 30,
          choices: []
        };

        emulators.forEach((em, i) => {
          promptOptions.choices.push({
            key: i,
            name: `iOS ${em.iosVersion} ${em.name} id=${em.id}`,
            value: em
          });
        });

        this.ui.prompt(promptOptions).then((selected) => {
          return this.buildAndRun(selected.emulator, options);
        });
      } else {
        //Preference --emulator vs emulatorID if passed
        let emulator;
        if (options.emulator) {
          emulator = emulators.find(function(em) {
            if (em.name === options.emulator) { return em; }
          });
        } else {
          emulator = emulators.find(function(em) {
            if (em.id === options.emulatorid) { return em; }
          });
        }

        return this.buildAndRun(emulator, options);
      }
    });
  }
});
