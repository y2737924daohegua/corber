const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const path            = require('path');
const contains        = td.matchers.contains;

const initValidator = function() {
  const ValidateWebpack  = require('../../../../../lib/frameworks/vue/validators/webpack-plugin');
  let validateWebpack = new ValidateWebpack();

  validateWebpack.configPath = path.join(
    mockProject.project.root,
    'build',
    'webpack.dev.conf.js'
  );

  return validateWebpack;
};

describe('Validate Webpack Plugin', function() {
  afterEach(function() {
    td.reset();
  });

  it('resolves if corber-webpack-plugin is listed', function() {
    let validateWebpack = initValidator();

    validateWebpack.configPath = path.join(
      mockProject.project.root,
      'build',
      'webpack-with-plugin.dev.conf.js'
    );

    return expect(validateWebpack.run()).to.be.fulfilled;
  });

  it('warns if corber-webpack-plugin is not listed', function() {
    let validateWebpack = initValidator();
    let warnMsgDouble = td.replace(validateWebpack, 'warnMsg');

    return validateWebpack.run().then(function() {
      td.verify(warnMsgDouble());
    });
  });

  context('warnMsg', function() {
    let warnDouble;

    beforeEach(function() {
      let logDouble = td.replace('../../../../../lib/utils/logger');
      warnDouble = td.replace(logDouble, 'warn');
    });

    it('includes vue specific info', function() {
      let validateWebpack = initValidator();
      validateWebpack.framework = 'vue';

      return validateWebpack.run().then(function() {
        td.verify(warnDouble(contains('build/webpack.dev.conf')));
      });
    });

    it('includes react specific info', function() {
      let validateWebpack = initValidator();
      validateWebpack.framework = 'react';

      return validateWebpack.run().then(function() {
        td.verify(warnDouble(contains('config/webpack.config.dev.js')));
      });
    });
  });
});

