const _pick           = require('lodash').pick;

const CORDOVA_OPTS = [
  'release',
  'debug',
  'emulator',
  'device',
  'buildConfig'
];

const IOS_OPTS = [
  'codeSignIdentity',
  'provisioningProfile',
  'codesignResourceRules',
  'developmentTeam',
  'packageType'
];

const ANDROID_OPTS = [
  'keystore',
  'storePassword',
  'alias',
  'password',
  'keystoreType',
  'gradleArg',
  'cdvBuildMultipleApks',
  'cdvVersionCode',
  'cdvReleaseSigningPropertiesFile',
  'cdvDebugSigningPropertiesFile',
  'cdvMinSdkVersion',
  'cdvBuildToolsVersion',
  'cdvCompileSdkVersion',
  'packageType'
];

module.exports = function(platform, options) {
  let platformKeys = [];

  if (platform === 'ios') {
    platformKeys = IOS_OPTS;
  } else if (platform === 'android') {
    platformKeys = ANDROID_OPTS;
  }

  let ret = _pick(options, CORDOVA_OPTS.concat(platformKeys));
  ret.argv = [].concat(...platformKeys
    .filter((key) => options.hasOwnProperty(key))
    .map((key) => [`--${key}`, options[key]]));

  return ret;
};
