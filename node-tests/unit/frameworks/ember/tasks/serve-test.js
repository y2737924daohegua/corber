const td             = require('testdouble');
const expect         = require('../../../../helpers/expect')
const Promise        = require('rsvp');
const isObject       = td.matchers.isA(Object);
const clone          = require('lodash').clone;
const mockProject    = require('../../../../fixtures/corber-mock/project');
const mockAnalytics  = require('../../../../fixtures/corber-mock/analytics');

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
      outputPath: 'corber/tmp-livereload',
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

    it('stubs valid ember addon /w treeFor function', function() {
      let stubbedAddon = cloned.addons[0];
      expect(cloned.addons.length).to.equal(1);
      expect(stubbedAddon.treeFor).to.be.a('function');
      expect(stubbedAddon.pkg).to.deep.equal({'ember-addon': {}});
      expect(stubbedAddon.root).to.equal('corber-livereload');
      expect(stubbedAddon.name).to.equal('corber-livereload');
      expect(stubbedAddon.addons).to.be.a('array');
      expect(stubbedAddon.addons.length).to.equal(0);
    });

    it('when treeFor is addon, it creates a Funnel with cordova-assets', function() {
      cloned.addons[0].treeFor('addon');

      td.verify(new Funnel(
        'corber/cordova', {
          srcDir: 'fake-src-dir',
          include: ['cordova.js', 'cordova_plugins.js']
        }
      ));
    });

    it('when treeFor is not addon, it does nothing', function() {
      cloned.addons[0].treeFor('app');

      td.verify(new Funnel(), { times: 0 });
    });
  });
});
