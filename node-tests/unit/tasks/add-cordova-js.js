 /* eslint-disable max-len */
var td              = require('testdouble');
var expect          = require('../../../../helpers/expect');
var Promise         = require('rsvp').Promise;
var path            = require('path');
var cordovaPath     = require('../../../../../lib/targets/cordova/utils/get-path');
var fsUtils         = require('../../../../../lib/utils/fs-utils');
var logger          = require('../../../../../lib/utils/logger');
var mockProject     = require('../../../../fixtures/ember-cordova-mock/project');

var AddCordovaJS    = require('../../../../../lib/targets/cordova/tasks/add-cordova-js');
 /* eslint-enable max-len */

describe('Add Cordova JS Task', function() {
  var projectPath = cordovaPath(mockProject.project);
  var source = 'www/index.html';
  var task, subject, infoArg, readFileArgs, writeFileArgs;

  afterEach(td.reset);

  beforeEach(function() {
    infoArg = null;
    readFileArgs = null;
    writeFileArgs = null;

    task = new AddCordovaJS({
      source: source,
      project: mockProject.project
    });

    td.replace(logger, 'info', function(message) {
      infoArg = message;
    });
  });

  context('when source contains Cordova script reference', function() {
    beforeEach(function() {
      td.replace(fsUtils, 'read', function(path) {
        readFileArgs = { path };

        return Promise.resolve(
          '<html>\n' +
          '<head>\n' +
          '  <link rel="stylesheet" href="/assets/vendor.css">\n' +
          '</head>\n' +
          '<body>\n' +
          '  <script src="cordova.js"></script>\n' +
          '  \n' +
          '  <script src="assets/vendor.js"></script>\n' +
          '</body>\n' +
          '</html>'
        );
      });

      subject = task.run();
    });

    it('calls fsUtils.read', function() {
      return subject.then(function() {
        expect(readFileArgs.path).to.eql(path.join(projectPath, source));
      });
    });

    it('prints path to index.html', function() {
      return subject.then(function() {
        expect(infoArg).to.contain(source);
      });
    });

    it('returns promise that resolves', function() {
      return expect(subject).to.be.fulfilled;
    });
  });

  context('when source does not contain Cordova script reference', function() {
    beforeEach(function() {
      td.replace(fsUtils, 'read', function(path) {
        readFileArgs = { path };

        return Promise.resolve(
          '<html>\n' +
          '<head>\n' +
          '  <link rel="stylesheet" href="/assets/vendor.css">\n' +
          '</head>\n' +
          '<body>\n' +
          '  <script src="assets/vendor.js"></script>\n' +
          '</body>\n' +
          '</html>'
        );
      });

      td.replace(fsUtils, 'write', function(path, contents) {
        writeFileArgs = { path, contents };

        return Promise.resolve();
      });

      subject = task.run();
    });

    it('calls fsUtils.read', function() {
      return subject.then(function() {
        expect(readFileArgs.path).to.eql(path.join(projectPath, source));
      });
    });

    it('calls fsUtils.write with added script reference', function() {
      return subject.then(function() {
        expect(writeFileArgs.path).to.eql(path.join(projectPath, source));
        expect(writeFileArgs.contents).to.contain(
          '<script src="cordova.js"></script>'
        );
      });
    });

    it('prints path to index.html', function() {
      return subject.then(function() {
        expect(infoArg).to.contain(source);
      });
    });

    it('returns promise that resolves', function() {
      return expect(subject).to.be.fulfilled;
    });
  });
});
