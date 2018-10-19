const td              = require('testdouble');
const CdvRawTask      = require('../../../lib/targets/cordova/tasks/raw');
const mockProject     = require('../../fixtures/corber-mock/project');
const mockAnalytics   = require('../../fixtures/corber-mock/analytics');
const isAnything      = td.matchers.anything();
const contains        = td.matchers.contains;

const stubCommand = function() {
  let PluginCmd = require('../../../lib/commands/plugin');

  let plugin = new PluginCmd({
    project: mockProject.project
  });
  plugin.analytics = mockAnalytics;

  return plugin;
};


describe('Plugin Command', function() {
  afterEach(function() {
    td.reset();
  });

  it('passes command to Cordova Raw', function() {
    let plugin = stubCommand();
    let rawDouble = td.replace(CdvRawTask.prototype, 'run');

    return plugin.run({}, ['add', 'cordova-plugin']).then(function() {
      td.verify(rawDouble('add', 'cordova-plugin', isAnything));
    });
  });

  it('passes the save flag', function() {
    let plugin = stubCommand();
    let rawDouble = td.replace(CdvRawTask.prototype, 'run');

    var opts = { save: false };
    return plugin.run(opts, ['add', 'cordova-plugin']).then(function() {
      td.verify(rawDouble('add', 'cordova-plugin', contains({ save: false })));
    });
  });

  it('defaults fetch to true', function() {
    let plugin = stubCommand();
    let rawDouble = td.replace(CdvRawTask.prototype, 'run');

    return plugin.run({}, ['add', 'cordova-plugin']).then(function() {
      td.verify(rawDouble('add', 'cordova-plugin', contains({ fetch: true })));
    });
  });

  it('passes args/vars to cordova arg sanitizer', function() {
    let Sanitizer = td.replace('../../../lib/targets/cordova/validators/addon-args');
    td.replace(CdvRawTask.prototype, 'run');

    let plugin = stubCommand();
    let opts = {variable: ['APP_ID=1234567890', 'APP_NAME=SomeApp']};

    plugin.run(opts, ['add', 'cordova-plugin']);

    td.verify(new Sanitizer({
      rawArgs: ['add', 'cordova-plugin'],
      varOpts: ['APP_ID=1234567890', 'APP_NAME=SomeApp'],
      api: 'plugin'
    }));
  });
});
