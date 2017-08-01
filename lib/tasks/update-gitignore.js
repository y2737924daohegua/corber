const Task            = require('./-task');
const fsUtils         = require('../utils/fs-utils');
const logger          = require('../utils/logger');
const includes        = require('lodash').includes;

const ignores = [
  'ember-cordova/tmp-livereload',
  'ember-cordova/cordova/node_modules',
  'ember-cordova/cordova/package.json',
  'ember-cordova/cordova/package-lock.json'
];

const emptyCheckins = [
  'ember-cordova/cordova/platforms/',
  'ember-cordova/cordova/plugins/',
  'ember-cordova/cordova/www/'
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
    logger.info('ember-cordova: updating .gitignore');

    return fsUtils.read('.gitignore', { encoding: 'utf8' })
      .then(function(contents) {

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
      });
  }
});
