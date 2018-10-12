'use strict';

var td              = require('testdouble');
var expect          = require('../../helpers/expect');
var mockProject     = require('../../fixtures/corber-mock/project');
var logger          = require('../../../lib/utils/logger');
var chalk           = require('chalk');
var contains        = td.matchers.contains;

var ValidateRoot    = require('../../../lib/validators/root-url');

var rejectMsg =
  chalk.red('* undefined dev: rootURL has a leading slash. \n') +
  chalk.grey(
    'This will not work in cordova, and needs to be removed. \n' +
    'You can pass the --force flag to ignore if otherwise handled. \n' +
    'See http://corber.io/pages/frameworks/index for more info.'
  );

describe('Validate Root Url', function() {
  var validateRoot;

  beforeEach(function() {
    validateRoot = new ValidateRoot({
      project: mockProject.project,
      rootProps: ['rootURL'],
      env: 'dev',
      config: mockProject.config()
    });
  });

  afterEach(function() {
    td.reset();
  });

  it('resolves', function() {
    td.replace(validateRoot, 'validRootValues', function(path) {
      return true;
    });

    return expect(validateRoot.run()).to.eventually.be.fulfilled;
  });

  it('rejects if validRootValues is false', function() {
    validateRoot.config = { rootURL: undefined };

    td.replace(validateRoot, 'validRootValues', function(path) {
      return false;
    });

    return expect(validateRoot.run()).to.eventually.be.rejected;
  });

  it('does not error when the value is undefined', function() {
    validateRoot.config = {};
    return expect(validateRoot.run()).to.eventually.be.fulfilled;
  });

  it('rejects when the config is null', function() {
    validateRoot.config = null;
    return expect(validateRoot.run()).to.eventually.be.rejected;
  });

  it('warns when the value is undefined', function() {
    validateRoot.config = {};
    var warnDouble = td.replace(logger, 'warn');

    return validateRoot.run().then(function() {
      td.verify(warnDouble(contains('Could not find rootURL in config')))
    });
  });

  it('when force is true, throws a warning vs rejection', function() {
    td.replace(validateRoot, 'validRootValues', function(path) {
      return false;
    });

    var warnDouble = td.replace(logger, 'warn');
    validateRoot.force = true;

    return validateRoot.run().then(function() {
      td.verify(warnDouble(contains('Detected the --force flag')));
    })
  });

  it('errorMsg returns an errorMsg with path, env & rootProps', function() {
    return expect(validateRoot.errorMsg()).to.equal(rejectMsg);
  });

  describe('validRootValues', function() {
    it('returns false if any values lead with /', function() {
      var values = ['valid', '/invalid'];
      expect(validateRoot.validRootValues(values)).to.equal(false);
    });

    it('returns true if no values lead with /', function() {
      var values = ['valid', 'invalid'];
      expect(validateRoot.validRootValues(values)).to.equal(true);
    });
  });
});
