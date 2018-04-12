const Command         = require('./-command');
const CreateProject   = require('../tasks/create-project');
const PlatformTask    = require('../targets/cordova/tasks/platform');
const logger          = require('../utils/logger');
const getOS           = require('../utils/get-os');
const RSVP            = require('rsvp');
const _pick           = require('lodash').pick;
const Promise         = RSVP.Promise;

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

  buildPromptOptions() {
    let platform = getOS();
    let promptOpts = {
      type: 'checkbox',
      name: 'platforms',
      message: 'Which platforms should we init with?',
      choices: [
        'none',
        'android'
      ]
    };

    if (platform === 'darwin') {
      promptOpts['choices'].push('ios');
    }

    return promptOpts;
  },

  promptPlatform() {
    let promptOpts = this.buildPromptOptions();
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


    return new Promise((resolve, reject) => {
      create.run().then(() => {
        if (opts.platform) {
          let platforms = this.getPlatforms(opts.platform);
          this.installPlatforms(platforms);
        } else {
          return this.promptPlatform().then((selected) => {
            let platforms = selected.platforms;
            if (platforms[0] === 'none') {
              logger.success('Project created with no platforms');
            } else {
              return this.installPlatforms(platforms, opts).then(() => {
                logger.success('Project created');
              });
            }
          });
        }
      }).then(resolve).catch(reject);
    });
  }
});
