const getCordovaPath   = require('../utils/get-path');
const path             = require('path');

module.exports = function(project) {
  let cordovaPath = getCordovaPath(project);
  let platformsPath = path.join(cordovaPath, 'platforms/platforms.json');
  let platformVersions = {};

  try {
    platformVersions = require(platformsPath);
  } catch (e) {
    if (!e.message.match(/Cannot find module/)) { throw e; }
  }

  return Object.keys(platformVersions);
}
