'use strict';

var td              = require('testdouble');
var expect          = require('../../helpers/expect');
var Promise         = require('rsvp').Promise;

var mockProject     = require('../../fixtures/corber-mock/project');
var mockAnalytics   = require('../../fixtures/corber-mock/analytics');

describe('Make Icons Command', function() {
  var iconTaskOptions, MakeIconsCmd, makeIcons;
  var addedPlatforms = ['ios', 'android'];

  beforeEach(function() {
    // Manually replace function because icon task returns a promise.
    td.replace('splicon/dist/icon-task', function(options) {
      // Assign options for verification because td.verify doesn't work with
      // manually replaced functions.
      iconTaskOptions = options;

      return Promise.resolve();
    });
  });

  afterEach(function() {
    iconTaskOptions = undefined;

    td.reset();
  });

  context('when added platforms', function() {
    var logger;

    beforeEach(function() {
      let getPlatforms = '../../../lib/targets/cordova/utils/get-platforms';
      td.replace(getPlatforms, function() {
        return addedPlatforms;
      });

      logger = td.replace('../../../lib/utils/logger');

      MakeIconsCmd = require('../../../lib/commands/make-icons');

      makeIcons = new MakeIconsCmd({
        project: mockProject.project,
        analytics: mockAnalytics
      });
    });

    context('when options and platform is `added`', function() {
      var options = {
        source: 'corber/icon.svg',
        platform: ['added']
      };

      beforeEach(function() {
        return makeIcons.run(options);
      });

      it('calls icon task with passed source, added platforms, and projectPath', function() {
        expect(iconTaskOptions.source).to.equal(options.source);
        expect(iconTaskOptions.platforms).to.deep.equal(addedPlatforms);
        expect(iconTaskOptions.projectPath).to.equal('corber/cordova');
      });

      it('logs the command starting with added platforms', function() {
        td.verify(logger.info(`corber: Generating icons for ${addedPlatforms.join(', ')}`));
      });
    });

    context('when options and platform is not `added`', function() {
      var options = {
        source: 'corber/icon.svg',
        platform: ['ios']
      };

      beforeEach(function() {
        return makeIcons.run(options);
      });

      it('calls icon task with passed source, passed platform, and projectPath', function() {
        expect(iconTaskOptions.source).to.equal(options.source);
        expect(iconTaskOptions.platforms).to.equal(options.platform);
        expect(iconTaskOptions.projectPath).to.equal('corber/cordova');
      });

      it('logs the command starting with passed platform', function() {
        td.verify(logger.info(`corber: Generating icons for ${options.platform.join(', ')}`));
      });
    });
  });

  context('when no added platforms', function() {
    beforeEach(function() {
      td.replace('../../../lib/utils/get-added-platforms', function() {
        return [];
      });

      MakeIconsCmd = require('../../../lib/commands/make-icons');

      makeIcons = new MakeIconsCmd({
        project: mockProject.project,
        analytics: mockAnalytics
      });
    });

    context('when options and platform is `added`', function() {
      var options = {
        source: 'corber/icon.svg',
        platform: ['added']
      };

      it('throws an error', function() {
        expect(function() { makeIcons.run(options) }).to.throw(Error);
      });
    });
  });
});
