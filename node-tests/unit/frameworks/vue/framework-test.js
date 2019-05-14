const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const mockProject    = require('../../../fixtures/corber-mock/project');
const InstallPackage = require('../../../../lib/tasks/install-package');

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
    expect(framework.serveCommand).to.equal('npm run serve');
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
    context('when package.json from Vue CLI v3', function() {
      beforeEach(function() {
        td.replace('../../../../lib/utils/get-package', () => {
          return { devDependencies: {} };
        });
      });

      context('when config exists', function() {
        let config = {configureWebpack: {plugins: []}};

        it('inits a root-url validator with config', function() {
          let ValidateRoot = td.replace('../../../../lib/validators/root-url');
          let framework = initFramework();

          td.replace(framework, '_getConfig', function () { return config; });

          framework._buildValidators('build', {});

          td.verify(new ValidateRoot({
            framework: 'vue',
            config: config,
            rootProps: ['publicPath'],
            path: 'vue.config.js',
            force: undefined,
            env: 'build'
          }));
        });
      });

      context('when config does not exists', function() {
        let config = null;

        it('inits a root-url validator with null config', function() {
          let ValidateRoot = td.replace('../../../../lib/validators/root-url');
          let framework = initFramework();

          td.replace(framework, '_getConfig', function () { return config; });

          framework._buildValidators('build', {});

          td.verify(new ValidateRoot({
            framework: 'vue',
            config: config,
            rootProps: ['publicPath'],
            path: 'vue.config.js',
            force: undefined,
            env: 'build'
          }));
        });
      });
    });

    context('when package.json from Vue CLI v2', function() {
      beforeEach(function() {
        td.replace('../../../../lib/utils/get-package', () => {
          return {
            devDependencies: {
              'webpack-dev-server': '^2.9.1'
            }
          };
        });
      });

      context('when config exists', function() {
        let config = {plugins: []};

        it('inits a root-url validator with config', function() {
          let ValidateRoot = td.replace('../../../../lib/validators/root-url');
          let framework = initFramework();

          td.replace(framework, '_getConfig', function () { return config; });

          framework._buildValidators('build', {});

          td.verify(new ValidateRoot({
            framework: 'vue',
            config: config,
            rootProps: ['publicPath'],
            path: 'build/webpack.dev.conf',
            force: undefined,
            env: 'build'
          }));
        });
      });

      context('when config does not exists', function() {
        let config = null;

        it('inits a root-url validator with null config', function() {
          let ValidateRoot = td.replace('../../../../lib/validators/root-url');
          let framework = initFramework();

          td.replace(framework, '_getConfig', function () { return config; });

          framework._buildValidators('build', {});

          td.verify(new ValidateRoot({
            framework: 'vue',
            config: config,
            rootProps: ['publicPath'],
            path: 'build/webpack.dev.conf',
            force: undefined,
            env: 'build'
          }));
        });
      });
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

    let ValidatePackage = td.replace('../../../../lib/validators/livereload-package');
    td.replace(ValidatePackage.prototype, 'run', function() {
      return 'validate-package';
    });

    let framework = initFramework();

    let passedEnv = undefined;
    td.replace(framework, '_buildValidators', function(env) {
      passedEnv = env;
      return ['validations'];
    });

    framework.validateServe({});

    expect(passedEnv).to.equal('dev');
    td.verify(runValidatorDouble(['validations', 'validate-package']));
  });

  describe('validateServe', function() {
    context('when package.json from Vue CLI v3', function() {
      beforeEach(function() {
        td.replace('../../../../lib/utils/get-package', () => {
          return { devDependencies: {} };
        });
      });

      it('passes required props to ValidateWebpack', function() {
        td.replace('../../../../lib/utils/run-validators');
        let ValidatePackage = td.replace('../../../../lib/validators/livereload-package');
        let framework = initFramework();

        let config = {configureWebpack: {plugins: []}};
        td.replace(framework, '_getConfig', function () { return config; });

        framework.validateServe({});

        td.verify(new ValidatePackage({
          root: mockProject.project.root,
          packageName: 'vue-cli-plugin-corber'
        }));
      });
    });
  });

  it('afterInstall runs InstallPackage with livereload addon', function() {
    let installedPackage;
    td.replace(InstallPackage.prototype, 'run', function(name) {
      installedPackage = name;
      return Promise.resolve();
    });

    let framework = initFramework();

    return framework.afterInstall().then(function() {
      expect(installedPackage).to.equal('vue-cli-plugin-corber');
    });
  });
});
