'use strict';

var Command         = require('./-command');
var CordovaRawTask  = require('../targets/cordova/tasks/raw');
var SanitizeArgs    = require('../targets/cordova/validators/addon-args');
var SetupWebView    = require('../targets/cordova/tasks/setup-webview');
var logger          = require('../utils/logger');

module.exports = Command.extend({
  name: 'platform',
  aliases: [ 'pl' ],
  description: 'Add/remove platforms',
  works: 'insideProject',

  /* eslint-disable max-len */
  availableOptions: [
    { name: 'save',                 type: Boolean,  default: true },
    { name: 'default-webview',      type: Boolean,  default: false },
    { name: 'crosswalk',            type: Boolean,  default: false },
    { name: 'uiwebview',            type: Boolean,  default: false },
    { name: 'link',                 type: String,  default: undefined }
  ],

  /* eslint-enable max-len */
  run: function(options, rawArgs) {
    this._super.apply(this, arguments);

    var project = this.project;
    var cordovaArgValidator = new SanitizeArgs({
      rawArgs: rawArgs,
      api: 'platform'
    });

    var platformTask = new CordovaRawTask({
      project: project,
      rawApi: 'platforms'
    });

    //TODO - flatten validator /w SetupWebView
    return cordovaArgValidator.run()
      .then(function(validated) {
        var action = validated.action;

        logger.info(
          'Preparing to ' + action + ' platform ' + rawArgs
        );

        var opts = { save: options.save, link: options.link };
        return platformTask.run(validated.action, validated.name, opts)
          .then(function() {
            //By default we upgrade the default WebView
            var platform = validated.name;

            if (action === 'add') {
              var setup = new SetupWebView({
                project: project,
                platform: platform,
                crosswalk: options.crosswalk,
                uiwebview: options.uiwebview
              });

              return setup.run();
            }
          });
      }).catch(function(err) {
        logger.error(err);
      });
  }
});
