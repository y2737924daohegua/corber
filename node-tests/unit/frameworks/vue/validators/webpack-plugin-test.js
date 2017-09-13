const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const path            = require('path');

/* eslint-disable max-len */
const ValidateWebpack  = require('../../../../../lib/frameworks/vue/validators/webpack-plugin');
/* eslint-enable max-len */

describe('Validate Webpack Plugin', function() {
  let validateWebpack;

  beforeEach(function() {
    validateWebpack = new ValidateWebpack();
  });

  afterEach(function() {
    td.reset();
  });

  it('resolves if corber-webpack-plugin is listed', function() {
    validateWebpack.configPath = path.join(
      mockProject.project.root,
      'build',
      'webpack-with-plugin.dev.conf.js'
    );

    return expect(validateWebpack.run()).to.be.fulfilled;
  });

  it('warns if corber-webpack-plugin is not listed', function() {
    validateWebpack.configPath = path.join(
      mockProject.project.root,
      'build',
      'webpack.dev.conf.js'
    );

    let warnDouble = td.replace(validateWebpack, 'warnMsg');

    return validateWebpack.run().then(function() {
      td.verify(warnDouble());
    });
  });
});

