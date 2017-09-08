const path             = require('path');

module.exports = function cordovaPath(project, excludeCordova) {
  let cdvPath = path.join(project.root, 'corber');

  return excludeCordova ?
    cdvPath :
    path.join(cdvPath, 'cordova');
};
