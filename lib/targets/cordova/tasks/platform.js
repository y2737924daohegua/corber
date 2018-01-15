const Task            = require('../../../tasks/-task');
const CordovaRaw      = require('./raw');
const SetupWebView    = require('./setup-webview');

module.exports = Task.extend({
  project: undefined,

  run(action, platform, opts) {
    let saveOpts = { save: opts.save, link: opts.link, fetch: true };

    let platformTask = new CordovaRaw({
      project: this.project,
      api: 'platforms'
    });

    return platformTask.run(action, platform, saveOpts).then(() => {
      //By default we upgrade the default WebView in IOS
      if (action === 'add') {
        let setup = new SetupWebView({
          project: this.project,
          platform: platform,
          crosswalk: opts.crosswalk,
          uiwebview: opts.uiwebview
        });

        return setup.run();
      }
    });
  }
});

