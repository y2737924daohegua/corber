const Command         = require('./-command');
const CreateProject   = require('../tasks/create-project');
const PlatformTask    = require('../targets/cordova/tasks/platform');
const logger          = require('../utils/logger');
const RSVP            = require('rsvp');
const _pick           = require('lodash').pick;

module.exports = Command.extend({
  name: 'init',
  aliases: ['i'],

  availableOptions: [
    { name: 'name',                 type: String },
    { name: 'cordovaid',            type: String },
    { name: 'template-path',        type: String },
    { name: 'platform',             type: String },
    { name: 'crosswalk',            type: Boolean,  default: false },
    { name: 'uiwebview',            type: Boolean,  default: false }
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

  installPlatforms(platforms, options) {
    let installs = [];
    let installOpts = _pick(options, 'crosswalk', 'uiwebview');
    installOpts.save = true;

    let addPlatform = new PlatformTask({ project: this.project });

    platforms.forEach((platform) => {
      logger.info(`Installing ${platform}`);
      installs.push(addPlatform.run('add', platform, installOpts));
    });

    return RSVP.allSettled(installs);
  },

  run(opts) {
    let create = new CreateProject({
      project: this.project,
      ui: this.ui,
      cordovaId: opts.cordovaId,
      name: opts.name,
      templatePath: opts.templatePath
    });


    return create.run().then(() => {
      if (opts.platform) {
        let platforms = this.getPlatforms(opts.platform);
        this.installPlatforms(platforms);
      } else {
        return this.promptPlatform().then((selected) => {
          if (selected.platforms[0] === 'none') {
            logger.success('Project created with no platforms');
          } else {
            return this.installPlatforms(selected.platforms, opts).then(() => {
              logger.success('Project created');
            });
          }
        });
      }
    });
  }
});
