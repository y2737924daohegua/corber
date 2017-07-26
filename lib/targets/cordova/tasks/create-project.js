'use strict';

var Task            = require('../../../tasks/-task');
var cordovaPath     = require('../utils/get-path');
var fsUtils         = require('../../../utils/fs-utils');
var logger          = require('../../../utils/logger');
var camelize        = require('../../../utils/string.js').camelize;

var Promise         = require('rsvp');

var cordovaProj     = require('cordova-lib').cordova;

//TODO - task is basically init
//Should not be different to init=project util

module.exports = Task.extend({
  id: undefined,
  name: undefined,
  templatePath: undefined,
  project: undefined,

  run: function() {
    var cdvPath = cordovaPath(this.project, false);

    if (!fsUtils.existsSync(cdvPath)) {
      var id = camelize(this.id);
      var name = camelize(this.name);

      var config = {
        lib: {
          www: { url: 'ember-cordova-template', template: true }
        }
      };

      if (this.templatePath !== undefined) {
        config.lib.www.url = this.templatePath;
      }

      return cordovaProj.raw.create(cdvPath, id, name, config);
    } else {
      logger.warn('Cordova dir already exists, please ensure it is valid');
      return Promise.resolve();
    }
  }
});
