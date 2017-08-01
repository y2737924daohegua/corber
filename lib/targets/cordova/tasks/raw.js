const Task            = require('../../../tasks/-task');
const Promise         = require('rsvp').Promise;
const cordovaPath     = require('../utils/get-path');
const cordovaLib      = require('cordova-lib');
const cordovaProj     = cordovaLib.cordova;
const events          = cordovaLib.events;
const cordovaLogger   = require('cordova-common').CordovaLogger.get();

module.exports = Task.extend({
  project: undefined,
  rawApi: undefined,

  cordovaRawPromise(/* rawArgs */) {
    return cordovaProj.raw[this.rawApi].apply(this, arguments);
  },

  run() {
    let args = arguments;
    return new Promise((resolve, reject) => {
      let emberPath = process.cwd();
      process.chdir(cordovaPath(this.project));

      cordovaLogger.subscribe(events);
      if (args[0] && args[0].verbose) { cordovaLogger.setLevel('verbose'); }

      this.cordovaRawPromise.apply(this, args).then(function() {
        process.chdir(emberPath);
        resolve();
      }).catch(function(err) {
        reject(err);
      });
    });
  }
});
