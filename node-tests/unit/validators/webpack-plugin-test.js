const td              = require('testdouble');
const mockProject     = require('../../fixtures/corber-mock/project');
const path            = require('path');
const contains        = td.matchers.contains;

const initValidator = function() {
  const ValidateWebpack  = require('../../../lib/validators/webpack-plugin');
  return new ValidateWebpack();
};

describe('Validate Webpack Plugin', function() {
  let validator;
  let warnDouble;

  beforeEach(function() {
    let logDouble = td.replace('../../../lib/utils/logger');
    warnDouble = td.replace(logDouble, 'warn');
  });

  afterEach(function() {
    td.reset();
  });

  context('when config path from Vue CLI v3', function() {
    beforeEach(function() {
      validator = initValidator();
      validator.root = mockProject.project.root;
      validator.framework = 'vue';
      validator.configPath = 'vue.config.js';
    });

    context('when configureWebpack property missing', function () {
      beforeEach(function() {
        validator.config = { baseUrl: './' };
      });

      it('warns and resolves', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(contains('vue.config.js')));
          done();
        }).catch(done);
      });
    });

    context('when plugins property missing', function () {
      beforeEach(function() {
        validator.config = {
          baseUrl: './',
          configureWebpack: {}
        };
      });

      it('warns and resolves', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(contains('vue.config.js')));
          done();
        }).catch(done);
      });
    });

    context('when plugins property missing webpack plugin', function () {
      beforeEach(function() {
        validator.config = {
          baseUrl: './',
          configureWebpack: {
            plugins: []
          }
        };
      });

      it('warns and resolves', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(contains('vue.config.js')));
          done();
        }).catch(done);
      });
    });

    context('when plugins property includes webpack plugin', function () {
      beforeEach(function() {
        function CorberWebpackPlugin() {}

        validator.config = {
          baseUrl: './',
          configureWebpack: {
            plugins: [new CorberWebpackPlugin()]
          }
        };
      });

      it('resolves silently', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(), { times: 0, ignoreExtraArgs: true });
          done();
        }).catch(done);
      });
    });
  });

  context('when config path from Vue CLI v2', function() {
    beforeEach(function() {
      validator = initValidator();
      validator.root = mockProject.project.root;
      validator.framework = 'vue';
      validator.configPath = path.join(
        'build',
        'webpack.dev.conf'
      );
    });

    context('when plugins property missing', function () {
      beforeEach(function() {
        validator.config = {
          baseUrl: './',
        };
      });

      it('warns and resolves', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(contains(path.join('build', 'webpack.dev.conf'))));
          done();
        }).catch(done);
      });
    });

    context('when plugins property missing webpack plugin', function () {
      beforeEach(function() {
        validator.config = {
          baseUrl: './',
          plugins: []
        };
      });

      it('warns and resolves', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(contains(path.join('build', 'webpack.dev.conf'))));
          done();
        }).catch(done);
      });
    });

    context('when plugins property includes webpack plugin', function () {
      beforeEach(function() {
        function CorberWebpackPlugin() {}

        validator.config = {
          baseUrl: './',
          plugins: [new CorberWebpackPlugin()]
        };
      });

      it('resolves silently', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(), { times: 0, ignoreExtraArgs: true });
          done();
        }).catch(done);
      });
    });
  });

  context('when config path is not from Vue CLI', function() {
    beforeEach(function() {
      validator = initValidator();
      validator.root = mockProject.project.root;
      validator.framework = 'react';
      validator.configPath = path.join(
        mockProject.project.root,
        'config',
        'webpack.config.dev.js'
      );
    });

    context('when plugins property missing', function () {
      beforeEach(function() {
        validator.config = {
          baseUrl: './',
        };
      });

      it('warns and resolves', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(contains(path.join('config', 'webpack.config.dev.js'))));
          done();
        }).catch(done);
      });
    });

    context('when plugins property missing webpack plugin', function () {
      beforeEach(function() {
        validator.config = {
          baseUrl: './',
          plugins: []
        };
      });

      it('warns and resolves', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(contains(path.join('config', 'webpack.config.dev.js'))));
          done();
        }).catch(done);
      });
    });

    context('when plugins property includes webpack plugin', function () {
      beforeEach(function() {
        function CorberWebpackPlugin() {}

        validator.config = {
          baseUrl: './',
          plugins: [new CorberWebpackPlugin()]
        };
      });

      it('resolves silently', function(done) {
        validator.run().then(function() {
          td.verify(warnDouble(), { times: 0, ignoreExtraArgs: true });
          done();
        }).catch(done);
      });
    });
  });
});

