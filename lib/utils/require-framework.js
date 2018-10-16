const path             = require('path');
const logger           = require('../utils/logger');

module.exports = function(project) {
  let Framework;
  try {
    Framework = require(path.join(
      project.root, 'corber/config/framework.js'
    ));
  } catch (err) {
    logger.error(`
      No corber/config/framework.js found.
      Have you run corber init?
    `);
    throw err;
  }

  let framework = new Framework({
    root: project.root
  });

  if (framework.name === 'ember' || framework.name === 'glimmer') {
    framework.project = project;
  }

  return framework;
};
