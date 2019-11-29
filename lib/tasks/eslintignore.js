const Task            = require('./-task');
const fsUtils         = require('../utils/fs-utils');
const logger          = require('../utils/logger');
const includes        = require('lodash').includes;

const ignores = [
  'corber/cordova',
];

const addLine = function(contents, path) {
  return '\n' + path;
};

const addIfNew = function(contents, path) {
  if (includes(contents, path) === false) {
    return addLine(contents, path);
  } else {
    return '';
  }
};

module.exports = Task.extend({
  project: undefined,

  run() {
    return fsUtils.read('.eslintignore', { encoding: 'utf8' })
      .then((contents) => {
        logger.info('corber: updating .eslintignore');

        this.eslintIgnore(contents);
      })
      .catch(() => {});
  },

  eslintIgnore(contents) {
    contents += addIfNew(contents, '\n# corber');

    ignores.forEach(function(ignore) {
      contents += addIfNew(contents, ignore);
    });

    return fsUtils.write('.eslintignore', contents);
  }
});
