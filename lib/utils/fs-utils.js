const fs               = require('fs');
const fsExtra          = require('fs-extra');
const RSVP             = require('rsvp')

const denodeify        = RSVP.denodeify
const fsReadFile       = denodeify(fs.readFile)
const fsWriteFile      = denodeify(fs.writeFile);
const fsMkdir          = denodeify(fs.mkdir);
const fsAppend         = denodeify(fs.appendFile);

module.exports = {
  read() {
    return fsReadFile.apply(this, arguments);
  },

  readSync() {
    return fs.readFileSync.apply(this, arguments);
  },

  write() {
    return fsWriteFile.apply(this, arguments);
  },

  existsSync() {
    return fs.existsSync.apply(this, arguments);
  },

  mkdir() {
    return fsMkdir.apply(this, arguments);
  },

  append() {
    return fsAppend.apply(this, arguments);
  },

  copy(source, destination) {
    return this.read(source, {encoding: 'utf8'}).then((contents) => {
      return this.write(destination, contents, {encoding: 'utf8'});
    });
  },

  copyDir(source, destination) {
    let defer = RSVP.defer();

    fsExtra.copy(source, destination, defer.resolve);

    return defer.promise;
  },

  empty(path) {
    let defer = RSVP.defer();

    fsExtra.emptyDir(path, defer.resolve);

    return defer.promise;
  }
}
