 /* eslint-disable max-len */
const td             = require('testdouble');
const expect         = require('../../../../helpers/expect')
const Promise        = require('rsvp');
const isObject       = td.matchers.isA(Object);
const clone          = require('lodash').clone;
const mockProject    = require('../../../../fixtures/ember-cordova-mock/project');
const mockAnalytics  = require('../../../../fixtures/ember-cordova-mock/analytics');
 /* eslint-enable max-len */

describe('Ember Serve Task', function() {
  let Serve, EmberBuilder, EmberWatcher, LiveReload, Express, Funnel;

  beforeEach(function() {
    EmberBuilder = td.replace('ember-cli/lib/models/builder');
    EmberWatcher = td.replace('ember-cli/lib/models/watcher');
    LiveReload = td.replace('ember-cli/lib/tasks/server/livereload-server');
    Express = td.replace('ember-cli/lib/tasks/server/express-server');
    Funnel = td.replace('broccoli-funnel');

    td.replace('../../../../../lib/targets/cordova/utils/cordova-assets', {
      validatePaths() {
        return Promise.resolve();
      },

      getPaths() {
        return {
          assetsPath: 'fake-src-dir',
          files: ['cordova.js', 'cordova_plugins.js']
        };
      }
    });

    Serve = require('../../../../../lib/frameworks/ember/tasks/serve');
  });

  afterEach(function() {
    td.reset();
  });

  it('starts liveReloadServer, expressServer & watcher', function() {
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

  context('stubEmberAddon', function() {
    let cloned;

    beforeEach(function() {
      let serve = new Serve({project: mockProject.project});
      cloned = clone(mockProject.project);
      serve.stubEmberAddon(cloned);
    });

    it('stubs treeFor function', function() {
      expect(cloned.addons.length).to.equal(1);
      expect(cloned.addons[0].treeFor).to.be.a('function');
    });

    it('creates a new Broccoli Funnel with cordova-assets paths', function() {
      cloned.addons[0].treeFor();

      td.verify(new Funnel(
        'ember-cordova/cordova', {
          srcDir: 'fake-src-dir',
          include: ['cordova.js', 'cordova_plugins.js']
        }
      ));
    });
  });
});
