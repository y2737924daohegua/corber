 /* eslint-disable max-len */
const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const mockProject    = require('../../../fixtures/ember-cordova-mock/project');
const WatchmanCfg    = require('../../../../lib/frameworks/ember/tasks/update-watchman-config');
const Promise        = require('rsvp').Promise;
const isAnything     = td.matchers.anything;
 /* eslint-enable max-len */

describe('Ember Framework', function() {
  let Build, Serve;

  beforeEach(function() {
    Build = td.replace('../../../../lib/frameworks/ember/tasks/build');
    Serve = td.replace('../../../../lib/frameworks/ember/tasks/serve');
  });

  afterEach(function() {
    td.reset();
  });

  it('has required props', function() {
    let Ember = require('../../../../lib/frameworks/ember/framework');
    let framework = new Ember();

    expect(framework.name).to.equal('ember');
    expect(framework.buildCommand).to.equal(undefined);
    expect(framework.buildPath).to.equal('/dist');
    expect(framework.port).to.equal(4200);
  });

  it('build initializes and runs a BuildTask', function() {
    let buildDouble = td.replace(Build.prototype, 'run');
    let Ember = require('../../../../lib/frameworks/ember/framework');
    let framework = new Ember({project: mockProject.project})

    framework.build({cordovaOutputPath: 'fakePath'});
    td.verify(new Build({
      project: mockProject.project,
      environment: isAnything(),
      outputPath: 'fakePath'
    }));

    td.verify(buildDouble());
  });

  it('serve initializes and runs a ServeTask', function() {
    let serveDouble = td.replace(Serve.prototype, 'run');
    let Ember = require('../../../../lib/frameworks/ember/framework');
    let framework = new Ember({project: mockProject.project})

    return framework.serve({port: 80}).then(function() {
      td.verify(new Serve({
        project: mockProject.project,
        ui: isAnything()
      }));

      td.verify(serveDouble({
        port: 80,
        liveReloadPort: isAnything(),
        baseURL: '/',
        rootURL: '/',
        project: mockProject.project
      }));
    });
  });


  it('validateBuild calls _buildValidators then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');
    let Ember = require('../../../../lib/frameworks/ember/framework');

    let framework = new Ember({project: mockProject.project});
    td.replace(framework, '_buildValidators', function() {
      return ['validations'];
    });

    framework.validateBuild({});
    td.verify(runValidatorDouble(['validations']));
  });

  it('validateServe calls _buildValidators then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');
    let Ember = require('../../../../lib/frameworks/ember/framework');

    let framework = new Ember({project: mockProject.project});
    td.replace(framework, '_buildValidators', function() {
      return ['validations'];
    });

    framework.validateServe({});
    td.verify(runValidatorDouble(['validations']));
  });

  context('buildValidators', function() {
    it('inits validations', function() {
      /* eslint-disable max-len */
      let ValidateLocation = td.replace('../../../../lib/frameworks/ember/validators/location-type');
      let ValidateRoot = td.replace('../../../../lib/frameworks/ember/validators/root-url');
      let Ember = require('../../../../lib/frameworks/ember/framework');

      let framework = new Ember({project: mockProject.project, isGlimmer: false});
      let validators = framework._buildValidators({});
      /* eslint-enable max-len */


      td.verify(new ValidateLocation({
        config: mockProject.project.config()
      }));

      td.verify(new ValidateRoot({
        config: mockProject.project.config(),
        force: undefined
      }));

      expect(validators.length).to.equal(2);
    });

    it('passes the force flag to ValidateRootURL', function() {
      /* eslint-disable max-len */
      let ValidateRoot = td.replace('../../../../lib/frameworks/ember/validators/root-url');
      let Ember = require('../../../../lib/frameworks/ember/framework');
      let framework = new Ember({project: mockProject.project, isGlimmer: false});
      /* eslint-enable max-len */

      framework._buildValidators({force: true});
      td.verify(new ValidateRoot({
        config: mockProject.project.config(),
        force: true
      }));
    });

    it('skips non-glimmer validations if isGlimmer === true', function() {
      let Ember = require('../../../../lib/frameworks/ember/framework');

      let framework = new Ember({
        project: mockProject.project,
        isGlimmer: true
      });

      let validators = framework._buildValidators({});
      expect(validators.length).to.equal(0);
    });
  });


  it('afterInstall runs UpdateWatchman task', function() {
    let tasks = [];

    td.replace(WatchmanCfg.prototype, 'run', function() {
      tasks.push('update-watchman-config');
      return Promise.resolve();
    });

    let Ember = require('../../../../lib/frameworks/ember/framework');
    let framework = new Ember({project: mockProject.project});

    return framework.afterInstall().then(function() {
      expect(tasks).to.deep.equal([
        'update-watchman-config'
      ]);
    });
  });
});
