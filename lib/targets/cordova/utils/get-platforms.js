const getCordovaPath = require('./get-path');
const fsUtils        = require('../../../utils/fs-utils');
const getPackage     = require('../../../utils/get-package');
const parseXml       = require('../../../utils/parse-xml');
const Promise        = require('rsvp').Promise;
const path           = require('path');
const lodash         = require('lodash');

module.exports = function getPlatforms(project = {}) {
  if (project.root === undefined) {
    throw new Error('\'root\' property missing from project');
  }

  let cordovaPath = getCordovaPath(project);
  let packageJSONPath = path.join(cordovaPath, 'package.json');
  let configXMLPath = path.join(cordovaPath, 'config.xml');

  if (fsUtils.existsSync(packageJSONPath)) {
    let packageJSON = getPackage(packageJSONPath);
    let platforms = lodash.get(packageJSON, 'cordova.platforms');
    if (platforms) {
      return Promise.resolve(platforms);
    }
  }

  if (fsUtils.existsSync(configXMLPath)) {
    return parseXml(configXMLPath).then((json) => {
      let engine = lodash.get(json, 'widget.engine') || [];
      return engine.map(p => p.$.name);
    });
  }

  return Promise.resolve([]);
};
