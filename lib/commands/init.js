const Command         = require('./-command');
const CreateProject   = require('../tasks/create-project');
const PlatformTask    = require('../targets/cordova/tasks/platform');
const logger          = require('../utils/logger');
const RSVP            = require('rsvp');

module.exports = Command.extend({
  name: 'init',
  aliases: ['i'],

  availableOptions: [
    { name: 'name',                 type: String },
    { name: 'cordovaid',            type: String },
    { name: 'template-path',        type: String },
    { name: 'platform',             type: String }
  ],

  getPlatforms(platformStr) {
    return platformStr.split(',');
  },

  promptPlatform() {
    let promptOpts = {
      type: 'checkbox',
      name: 'platforms',
      message: 'Which platforms should we init with?',
      choices: [
        'none',
        'android',
        'ios'
      ]
    };

    return this.ui.prompt(promptOpts);
  },

  installPlatforms(platforms) {
    let installs = [];
    let addPlatform = new PlatformTask({ project: this.project });

    platforms.forEach((platform) => {
      logger.info(`Installing ${platform}`);
      installs.push(addPlatform.run('add', platform, { save: true }));
    });

    return RSVP.allSettled(installs);
  },

  run(options) {
    let create = new CreateProject({
      project: this.project,
      ui: this.ui,
      cordovaId: options.cordovaId,
      name: options.name,
      templatePath: options.templatePath
    });


    return create.run().then(() => {
      if (options.platform) {
        let platforms = this.getPlatforms(options.platform);
        this.installPlatforms(platforms);
      } else {
        return this.promptPlatform().then((selected) => {
          if (selected.platforms[0] === 'none') {
            logger.success('Project created with no platforms');
          } else {
            return this.installPlatforms(selected.platforms).then(() => {
              logger.success('Project created');
            });
          }
        });
      }
    });
  }
});
