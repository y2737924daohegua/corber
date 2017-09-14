const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const mockProject    = require('../../../fixtures/corber-mock/project');
const path           = require('path');

const initFramework = function() {
  let Vue = require('../../../../lib/frameworks/vue/framework');
  return new Vue({root: mockProject.project.root});
};

describe('Vue Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('has required props', function() {
    let framework = initFramework();

    expect(framework.name).to.equal('vue');
    expect(framework.buildCommand).to.equal('npm run build');
    expect(framework.serveCommand).to.equal('node build/dev-server.js');
    expect(framework.buildPath).to.equal('./dist');
    expect(framework.port).to.equal(8080);
  });

  it('build initializes a new BuildTask', function() {
    let BuildTask = td.replace('../../../../lib/tasks/bash-build');
    let buildDouble = td.replace(BuildTask.prototype, 'run');
    let framework = initFramework();

    framework.build({cordovaOutputPath: 'fakePath'});
    td.verify(new BuildTask({
      cordovaOutputPath: 'fakePath',
      buildCommand: 'npm run build',
      buildPath: './dist'
    }));

    td.verify(buildDouble());
  });

  it('serve intializes a new ServeTask', function() {
    let ServeTask = td.replace('../../../../lib/tasks/bash-serve');
    let serveDouble = td.replace(ServeTask.prototype, 'run');
    let framework = initFramework();

    framework.serve({platform: 'ios'});
    td.verify(new ServeTask({
      command: framework.serveCommand,
      platform: 'ios'
    }));

    td.verify(serveDouble());
  });

  describe('buildValidators', function() {
    it('inits a root-url validator', function() {
      let ValidateRoot = td.replace('../../../../lib/validators/root-url');
      let framework = initFramework();

      framework._buildValidators('build', {});

      td.verify(new ValidateRoot({
        config: {},
        rootProps: ['assetsPublicPath'],
        path: 'config/index.js',
        force: undefined,
        env: 'build'
      }));
    });
  });

  it('validateBuild calls _buildValidators then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');
    let framework = initFramework();

    let passedEnv = undefined;
    td.replace(framework, '_buildValidators', function(env) {
      passedEnv = env;
      return ['validations'];
    });

    framework.validateBuild({});

    expect(passedEnv).to.equal('build');
    td.verify(runValidatorDouble(['validations']));
  });

  it('validateServe calls _buildValidators then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');

    let ValidateWebpack = td.replace('../../../../lib/validators/webpack-plugin');
    td.replace(ValidateWebpack.prototype, 'run', function() {
      return 'validate-webpack';
    });

    let framework = initFramework();

    let passedEnv = undefined;
    td.replace(framework, '_buildValidators', function(env) {
      passedEnv = env;
      return ['validations'];
    });

    framework.validateServe({});

    expect(passedEnv).to.equal('dev');
    td.verify(runValidatorDouble(['validations', 'validate-webpack']));
  });

  it('validateServe passes required props to ValidateWebpack', function() {
    td.replace('../../../../lib/utils/run-validators');
    let ValidateWebpack = td.replace('../../../../lib/validators/webpack-plugin');
    let framework = initFramework();

    framework.validateServe({});

    td.verify(new ValidateWebpack({
      configPath: path.join(mockProject.project.root, 'build', 'webpack.dev.conf'),
      framework: 'vue'
    }));
  });
});
