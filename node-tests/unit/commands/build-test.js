const td             = require('testdouble');
const expect         = require('../../helpers/expect');
const Promise        = require('rsvp').Promise;
const mockProject    = require('../../fixtures/corber-mock/project');
const mockAnalytics  = require('../../fixtures/corber-mock/analytics');
const path           = require('path');
const lodash         = require('lodash');
const contains       = td.matchers.contains;
const anything       = td.matchers.anything;

describe('Build Command', () => {
  let requireFramework;
  let requireTarget;
  let addCordovaJS;
  let lintIndex;
  let resolvePlatform;

  let project;
  let opts;

  let setupCommand = () => {
    let BuildCmd = require('../../../lib/commands/build');
    let build = new BuildCmd({
      project
    });

    build.analytics = mockAnalytics;

    return build;
  };

  let setupTaskTracking = (tasks) => {
    let stubTask = (id, returnValue) => {
      return (...args) => {
        let label = typeof (id) === 'function' ? id(...args) : id;
        tasks.push(label);
        return Promise.resolve(returnValue);
      }
    };

    td.replace('../../../lib/tasks/run-hook', stubTask((name) => `hook ${name}`));
    td.replace('../../../lib/tasks/add-cordova-js', stubTask('add-cordova-js'));
    td.replace('../../../lib/tasks/lint-index', stubTask('lint-index'));

    td.when(requireTarget(project), { ignoreExtraArgs: true }).thenReturn({
      validateBuild: stubTask('cordova-target-validate-build'),
      build: stubTask('cordova-target-build')
    });

    td.when(requireFramework(project)).thenReturn({
      validateBuild: stubTask('framework-validate-build'),
      build: stubTask('framework-build')
    });
  };

  beforeEach(() => {
    requireFramework = td.replace('../../../lib/utils/require-framework');
    requireTarget    = td.replace('../../../lib/utils/require-target');
    addCordovaJS     = td.replace('../../../lib/tasks/add-cordova-js');
    lintIndex        = td.replace('../../../lib/tasks/lint-index');
    resolvePlatform  = td.replace('../../../lib/commands/utils/resolve-platform');

    td.replace('../../../lib/tasks/run-hook');
    td.replace('../../../lib/utils/logger');

    project = lodash.cloneDeep(mockProject.project);
    project.config = () => {
      return {
        locationType: 'hash'
      };
    };

    opts = {
      cordovaOutputPath: 'corber/cordova/www'
    };

    td.when(requireTarget(project), { ignoreExtraArgs: true })
      .thenReturn(td.object(['validateBuild', 'build']));

    td.when(requireFramework(project))
      .thenReturn(td.object(['validateBuild', 'build']));
  });

  afterEach(() => {
    td.reset();
  });

  describe('run', () => {
    beforeEach(() => {

    });

    it('exits cleanly', () => {
      let build = setupCommand();
      return expect(build.run(opts)).to.eventually.be.fulfilled;
    });

    it('runs tasks in the correct order', () => {
      let tasks = [];
      setupTaskTracking(tasks);

      let build = setupCommand();

      return build.run(opts).then(() => {
        //h-t ember-electron for the pattern
        expect(tasks).to.deep.equal([
          'hook beforeBuild',
          'framework-validate-build',
          'cordova-target-validate-build',
          'framework-build',
          'add-cordova-js',
          'cordova-target-build',
          'hook afterBuild',
          'lint-index'
        ]);
      });
    });

    it('skips ember-build with the --skip-ember-build flag', () => {
      let tasks = [];
      setupTaskTracking(tasks);

      let build = setupCommand();

      opts.skipFrameworkBuild = true;

      return build.run(opts)
      .then(() => {
        //h-t ember-electron for the pattern
        expect(tasks).to.deep.equal([
          'hook beforeBuild',
          'framework-validate-build',
          'cordova-target-validate-build',
          'cordova-target-build',
          'hook afterBuild',
          'lint-index'
        ]);
      });
    });

    it('adds cordova-js with --add-cordova-js --skip-framework-build flags', () => {
      let tasks = [];
      setupTaskTracking(tasks);

      let build = setupCommand();

      opts.skipFrameworkBuild = true;
      opts.addCordovaJs = true;

      return build.run(opts).then(() => {
        //h-t ember-electron for the pattern
        expect(tasks).to.deep.equal([
          'hook beforeBuild',
          'framework-validate-build',
          'cordova-target-validate-build',
          'add-cordova-js',
          'cordova-target-build',
          'hook afterBuild',
          'lint-index'
        ]);
      });
    });

    it('skips cordova-build with the --skip-cordova-build flag', () => {
      let tasks = [];
      setupTaskTracking(tasks);

      let build = setupCommand();

      opts.skipCordovaBuild = true;

      return build.run(opts)
      .then(() => {
        //h-t ember-electron for the pattern
        expect(tasks).to.deep.equal([
          'hook beforeBuild',
          'framework-validate-build',
          'cordova-target-validate-build',
          'framework-build',
          'add-cordova-js',
          'hook afterBuild',
          'lint-index'
        ]);
      });
    });

    it('calls addCordovaJS as expected', () => {
      let build = setupCommand();

      return build.run(opts).then(() => {
        let source = path.join('corber', 'cordova', 'www', 'index.html');
        td.verify(addCordovaJS(source));
      });
    });

    it('constructs lint index as expected', () => {
      let build = setupCommand();

      return build.run(opts).then(() => {
        let source = path.join('corber', 'cordova', 'www', 'index.html');
        td.verify(lintIndex(source));
      });
    });

    it('supports custom output path with --cordova-output-path option', () => {
      let build = setupCommand();

      opts.cordovaOutputPath = 'foo';

      return build.run(opts).then(() => {
        let source = path.join('foo', 'index.html');
        td.verify(addCordovaJS(source));
        td.verify(lintIndex(path.join('foo', 'index.html')));
      });
    });

    it('sets process.env.CORBER_PLATFORM', () => {
      let build = setupCommand();

      td.when(resolvePlatform(project), { ignoreExtraArgs: true })
        .thenReturn(Promise.resolve('platform'));

      return build.run(opts).then(() => {
        expect(process.env.CORBER_PLATFORM).to.equal('platform');
      });
    });

    it('sets opts.platform', () => {
      let build = setupCommand();

      td.when(resolvePlatform(project), { ignoreExtraArgs: true })
        .thenReturn(Promise.resolve('platform'));

      return build.run(opts).then(() => {
        expect(opts.platform).to.equal('platform');
      });
    });
  });

  it('passes Xcode legacy build flag to requireTarget for ios', () => {
    td.when(resolvePlatform(project, anything())).thenReturn('ios');
    let build = setupCommand();

    return build.run(opts).then(() => {
      let options = contains({ buildFlag: ['-UseModernBuildSystem=NO'] });
      td.verify(requireTarget(anything(), options));
    });
  });

  it('does not pass Xcode legacy build flag to requireTarget for android', () => {
    td.when(resolvePlatform(project, anything())).thenReturn('android');
    let build = setupCommand();

    return build.run(opts).then(() => {
      let options = contains({ buildFlag: ['-UseModernBuildSystem=NO'] });
      td.verify(requireTarget(anything(), options), { times: 0 });
    });
  });
});
