var getCordovaPath  = require('../utils/get-path');
var path            = require('path');

module.exports = function(project) {
  var cordovaPath = getCordovaPath(project);
  var platformsPath = path.join(cordovaPath, 'platforms/platforms.json');
  var platformVersions = {};

  try {
    platformVersions = require(platformsPath);
  } catch (e) {
    if (!e.message.match(/Cannot find module/)) { throw e; }
  }

  return Object.keys(platformVersions);
}
