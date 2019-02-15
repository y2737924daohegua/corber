const td              = require('testdouble');
const expect          = require('../../helpers/expect');
const Promise         = require('rsvp').Promise;
const fsUtils         = require('../../../lib/utils/fs-utils');
const logger          = require('../../../lib/utils/logger');
const addCordovaJS    = require('../../../lib/tasks/add-cordova-js');

describe('Add Cordova JS Task', () => {
  let source = 'www/index.html';
  let subject, infoArg, readFileArgs, writeFileArgs;

  afterEach(td.reset);

  beforeEach(() => {
    infoArg = null;
    readFileArgs = null;
    writeFileArgs = null;

    td.replace(logger, 'info', (message) => {
      infoArg = message;
    });
  });

  context('when source contains Cordova script reference', () => {
    beforeEach(() => {
      td.replace(fsUtils, 'read', (path) => {
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

      subject = addCordovaJS(source);
    });

    it('calls fsUtils.read', () => {
      return subject.then(() => {
        expect(readFileArgs.path).to.eql(source);
      });
    });

    it('prints path to index.html', () => {
      return subject.then(() => {
        expect(infoArg).to.contain(source);
      });
    });

    it('returns promise that resolves', () => {
      return expect(subject).to.be.fulfilled;
    });
  });

  context('when source does not contain Cordova script reference', () => {
    beforeEach(() => {
      td.replace(fsUtils, 'read', (path) => {
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

      td.replace(fsUtils, 'write', (path, contents) => {
        writeFileArgs = { path, contents };

        return Promise.resolve();
      });

      subject = addCordovaJS(source);
    });

    it('calls fsUtils.read', () => {
      return subject.then(() => {
        expect(readFileArgs.path).to.eql(source);
      });
    });

    it('calls fsUtils.write with added script reference', () => {
      return subject.then(() => {
        expect(writeFileArgs.path).to.eql(source);
        expect(writeFileArgs.contents).to.contain(
          '<script src="cordova.js"></script>'
        );
      });
    });

    it('prints path to index.html', () => {
      return subject.then(() => {
        expect(infoArg).to.contain(source);
      });
    });

    it('returns promise that resolves', () => {
      return expect(subject).to.be.fulfilled;
    });
  });
});
