const path          = require('path');
const get           = require('lodash').get;
const logger        = require('../utils/logger');

module.exports = function(project) {
  let Framework;
  try {
    Framework = require(path.join(project.root, 'ember-cordova/config/config.js'));
  } catch (err) {
    logger.error('No ember-cordova/config.js found');
  }

  let framework = new Framework({
    root: project.root
  });

  if (framework.name === 'ember' || framework.name === 'glimmer') {
    framework.project = project;
  }

  return framework;
};
