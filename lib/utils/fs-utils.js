var fs              = require('fs');
var RSVP            = require('rsvp')

var denodeify       = RSVP.denodeify
var fsReadFile      = denodeify(fs.readFile)
var fsWriteFile     = denodeify(fs.writeFile);
var fsMkdir         = denodeify(fs.mkdir);
var fsAppend        = denodeify(fs.appendFile);
var fsCopy          = denodeify(fs.copy);

module.exports = {
  read: function() {
    return fsReadFile.apply(this, arguments);
  },

  readSync: function() {
    return fs.readFileSync.apply(this, arguments);
  },

  write: function() {
    return fsWriteFile.apply(this, arguments);
  },

  existsSync: function() {
    return fs.existsSync.apply(this, arguments);
  },

  mkdir: function() {
    return fsMkdir.apply(this, arguments);
  },

  append: function() {
    return fsAppend.apply(this, arguments);
  },

  copy: function(source, destination) {
    return this.read(source, {encoding: 'utf8'}).then(function(contents) {
      return this.write(destination, contents, {encoding: 'utf8'});
    }.bind(this));
  }
}
