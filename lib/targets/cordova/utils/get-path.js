const path             = require('path');

module.exports = function cordovaPath(project, excludeCordova) {
  let cdvPath = path.join(project.root, 'ember-cordova');

  return excludeCordova ?
    cdvPath :
    path.join(cdvPath, 'cordova');
};
