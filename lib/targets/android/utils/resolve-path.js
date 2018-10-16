const fsUtils = require('../../../utils/fs-utils');

module.exports = function(paths) {
  let resolvedPath = paths.find((path) => {
    return fsUtils.existsSync(path);
  });

  return resolvedPath;
};
