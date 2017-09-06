 /* eslint-disable max-len */
const td             = require('testdouble');
const isObject       = td.matchers.isA(Object);
const mockProject    = require('../../../../fixtures/ember-cordova-mock/project');
const mockAnalytics  = require('../../../../fixtures/ember-cordova-mock/analytics');
 /* eslint-enable max-len */

describe('Ember Serve Task', function() {
  it('starts liveReloadServer, expressServer & watcher', function() {
    let EmberBuilder = td.replace('ember-cli/lib/models/builder');
    let EmberWatcher = td.replace('ember-cli/lib/models/watcher');
    let LiveReload = td.replace('ember-cli/lib/tasks/server/livereload-server');
    let Express = td.replace('ember-cli/lib/tasks/server/express-server');

    let Serve = require('../../../../../lib/frameworks/ember/tasks/serve');
    let serve = new Serve({project: mockProject.project});

    serve.run({environment: 'development'});

    td.verify(new EmberWatcher({
      ui: undefined,
      builder: isObject,
      analytics: mockAnalytics,
      options: { environment: 'development' }
    }));

    td.verify(new Express({
      ui: undefined,
      project: isObject,
      watcher: isObject,
      serverRoot: './server'
    }));

    td.verify(new EmberBuilder({
      ui: undefined,
      outputPath: 'ember-cordova/tmp-livereload',
      project: isObject,
      environment: 'development'
    }))

    td.verify(new LiveReload({
      ui: undefined,
      analytics: mockAnalytics,
      project: isObject,
      watcher: isObject,
      expressServer: isObject
    }));
  });
});
