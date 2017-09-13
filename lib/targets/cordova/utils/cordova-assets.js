const path            = require('path');
const logger          = require('../../../utils/logger');
const existsSync      = require('../../../utils/fs-utils').existsSync;

module.exports = {
  getPaths(platform, projectPath) {
    let platformsPath = 'platforms';
    let assetsPath;

    if (platform === 'ios') {
      assetsPath = path.join(platformsPath, 'ios', 'www');
    } else if (platform === 'android') {
      assetsPath = path.join(platformsPath, 'android', 'assets', 'www');
    } else if (platform === 'browser') {
      assetsPath = path.join(platformsPath, 'browser', 'www');
    }

    let files = ['cordova_plugins.js', 'cordova.js'];

    let pluginPath = path.join(projectPath, assetsPath, 'plugins');
    if (existsSync(pluginPath)) {
      files.push('plugins/**');
    }

    return {
      assetsPath: assetsPath,
      files: files
    }
  },

  /* eslint-disable max-len */
  validatePaths(assetsPath, projectPath) {
    if (assetsPath === undefined) {
      throw new Error('corber: Platform asset path undefined, cant build');
    }

    let platformPath = path.join(projectPath, assetsPath, 'cordova.js');
    let pluginPath = path.join(projectPath, assetsPath, 'cordova_plugins.js');

    if (!existsSync(platformPath) || !existsSync(pluginPath)) {
      logger.warn(
        'Did not find cordova.js or cordova_plugins.js at ' +
        assetsPath +
        '. Ember App LiveReload will still work, but device & plugin APIS will fail.'
      );
    }
  }
  /* eslint-enable max-len */
};
