const path          = require('path');
const get           = require('lodash').get;
const logger        = require('../utils/logger');
const CordovaTarget = require('../targets/cordova/target');
const cdvBuildFlags = require('../targets/cordova/utils/parse-build-flags');

module.exports = function(project, opts) {
  let cordovaOpts = cdvBuildFlags(opts.platform, opts);

  return new CordovaTarget({
    platform: opts.platform,
    project: project,
    cordovaOpts: cordovaOpts
  });
};
