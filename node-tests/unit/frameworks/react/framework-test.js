const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const mockProject    = require('../../../fixtures/corber-mock/project');
const path           = require('path');
const InstallPackage = require('../../../../lib/tasks/install-package');

const initFramework = function() {
  let React = require('../../../../lib/frameworks/react/framework');
  return new React({root: mockProject.project.root});
};

describe('React Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('has required props', function() {
    let framework = initFramework();

    expect(framework.name).to.equal('react');
    expect(framework.buildCommand).to.equal('npm run build');
    expect(framework.serveCommand).to.equal('node scripts/start.js');
    expect(framework.buildPath).to.equal('./build');
    expect(framework.port).to.equal(3000);
  });

  it('build initializes a new BuildTask', function() {
    let BuildTask = td.replace('../../../../lib/tasks/bash-build');
    let buildDouble = td.replace(BuildTask.prototype, 'run');

    let framework = initFramework();

    framework.build({cordovaOutputPath: 'fakePath'});
    td.verify(new BuildTask({
      cordovaOutputPath: 'fakePath',
      buildCommand: 'npm run build',
      buildPath: './build'
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

  it('buildValidators inits ValidateHomepage', function() {
    let ValidateHomepage = td.replace('../../../../lib/frameworks/react/validators/homepage');
    let framework = initFramework();

    framework._buildValidators();
    td.verify(new ValidateHomepage({
      root: mockProject.project.root
    }));
  });

  it('validateBuild calls buildValidators & then runs validators', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');

    let framework = initFramework();
    td.replace(framework, '_buildValidators', function() {
      return ['validations'];
    });

    framework.validateBuild();
    td.verify(runValidatorDouble(['validations']));
  });

  it('validateServe calls buildValdators, adds ValidateWebpack & runs validatgors', function() {
    let runValidatorDouble = td.replace('../../../../lib/utils/run-validators');

    let ValidateWebpack = td.replace('../../../../lib/validators/webpack-plugin');
    td.replace(ValidateWebpack.prototype, 'run', function() {
      return 'validate-webpack';
    });

    let framework = initFramework();
    td.replace(framework, '_buildValidators', function() {
      return ['validations'];
    });

    framework.validateServe();
    td.verify(runValidatorDouble(['validations', 'validate-webpack']));
  });

  it('validateServe passes required props to ValidateWebpack', function() {
    td.replace('../../../../lib/utils/run-validators');
    let ValidateWebpack = td.replace('../../../../lib/validators/webpack-plugin');
    let framework = initFramework();

    let config = {configureWebpack: {plugins: []}};
    td.replace(framework, '_getConfig', function () { return config; });

    framework.validateServe({});

    td.verify(new ValidateWebpack({
      config: config,
      configPath: path.join('config', 'webpack.config.dev.js'),
      framework: 'react'
    }));
  });

  it('afterInstall runs InstallPackage with livereload addon', function() {
    let installedPackage;
    td.replace(InstallPackage.prototype, 'run', function(name) {
      installedPackage = name;
      return Promise.resolve();
    });

    let framework = initFramework();

    return framework.afterInstall().then(function() {
      expect(installedPackage).to.equal('corber-webpack-plugin');
    });
  });
});
