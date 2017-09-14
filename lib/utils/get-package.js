const path             = require('path');

module.exports = function(root) {
  return require(path.join(root, 'package.json'));
};
