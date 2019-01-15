const spawn           = require('../../../utils/spawn');
const path            = require('path');

module.exports = function(deviceId, bundlePath, root) {
  let iosDeploy = path.join(
    root,
    'node_modules',
    'corber',
    'node_modules',
    'ios-deploy',
    'build',
    'Release',
    'ios-deploy'
  );

  let install = [
    iosDeploy,
    [
      '--id',
      deviceId,
      '--bundle',
      bundlePath,
      '--justlaunch'
    ]
  ];

  return spawn(...install);
};
