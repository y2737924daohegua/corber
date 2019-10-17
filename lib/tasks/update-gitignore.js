const Task            = require('./-task');
const fsUtils         = require('../utils/fs-utils');
const logger          = require('../utils/logger');
const includes        = require('lodash').includes;

const ignores = [
  'corber/tmp-livereload',
  'corber/cordova/node_modules',
];

const emptyCheckins = [
  'corber/cordova/platforms/',
  'corber/cordova/plugins/',
  'corber/cordova/www/'
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
    logger.info('corber: updating .gitignore');

    return fsUtils.read('.gitignore', { encoding: 'utf8' })
      .then((contents) => this.updateGitIgnore(contents))
      .catch(() => {
        this.updateGitIgnore('');
      });
  },

  updateGitIgnore(contents) {
    ignores.forEach(function(ignore) {
      contents += addIfNew(contents, ignore);
    });

    emptyCheckins.forEach(function(item) {
      //First add each item
      contents += addIfNew(contents, item + '*');

      //Add an empty gitKeep as these folders should be checked in
      let gitkeepPath = item + '.gitkeep';
      contents += addIfNew(contents, '!' + gitkeepPath);

      //Create the empty gitkeep
      fsUtils.write(gitkeepPath, '', { encoding: 'utf8' });
    });

    return fsUtils.write('.gitignore', contents);
  }
});
