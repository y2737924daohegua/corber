const getCordovaPath   = require('../targets/cordova/utils/get-path');
const logger           = require('../utils/logger');
const fsUtils          = require('../utils/fs-utils');
const Promise          = require('rsvp').Promise;
const path             = require('path');

module.exports = function runHook(hookName, hookOptions, options = {}) {
  let projectPath, hookPath, hook, hookReturn;
  let { root } = options;

  projectPath = getCordovaPath({ root }, true);
  hookPath = path.join(projectPath, 'hooks', hookName);

  if (!fsUtils.existsSync(`${hookPath}.js`)) {
    // it's OK if a hook doesn't exist, most people won't use them
    return Promise.resolve();
  }

  logger.info(`Located hook '${hookName}'`);
  hook = require(hookPath);

  try {
    hookReturn = hook(hookOptions);
  } catch (e) {
    let message = e.message ? e.message : e;
    logger.error(`Hook '${hookName}' exited with exception: ${message}`);
    return Promise.reject(e);
  }

  return Promise.resolve(hookReturn).then((value) => {
    logger.success(`Executed hook '${hookName}'`);
    return value;
  }).catch((e) => {
    let message = e.message ? e.message : e;
    logger.error(`Hook '${hookName}' exited with rejection: ${message}`);
    throw e;
  });
};
