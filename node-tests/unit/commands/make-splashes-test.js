'use strict';

var td              = require('testdouble');
var expect          = require('../../helpers/expect');
var Promise         = require('rsvp').Promise;

var mockProject     = require('../../fixtures/corber-mock/project');
var mockAnalytics   = require('../../fixtures/corber-mock/analytics');

describe('Make Splashes Command', function() {
  var splashTaskOptions, MakeSplashesCmd, makeSplashes;
  var addedPlatforms = ['ios', 'android'];

  beforeEach(function() {
    // Manually replace function because splash task returns a promise.
    td.replace('splicon/src/splash-task', function(options) {
      // Assign options for verification because td.verify doesn't work with
      // manually replaced functions.
      splashTaskOptions = options;

      return Promise.resolve();
    });
  });

  afterEach(function() {
    splashTaskOptions = undefined;

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

      MakeSplashesCmd = require('../../../lib/commands/make-splashes');

      makeSplashes = new MakeSplashesCmd({
        project: mockProject.project,
        analytics: mockAnalytics
      });
    });

    context('when options and platform is `added`', function() {
      var options = {
        source: 'corber/splash.svg',
        platform: ['added']
      };

      beforeEach(function() {
        return makeSplashes.run(options);
      });

      it('calls splash task with passed source, added platforms, and projectPath', function() {
        expect(splashTaskOptions.source).to.equal(options.source);
        expect(splashTaskOptions.platforms).to.deep.equal(addedPlatforms);
        expect(splashTaskOptions.projectPath).to.equal('corber/cordova');
      });

      it('logs the command starting with added platforms', function() {
        td.verify(logger.info(`corber: Generating splashes for ${addedPlatforms.join(', ')}`));
      });
    });

    context('when options and platform is not `added`', function() {
      var options = {
        source: 'corber/splash.svg',
        platform: ['ios']
      };

      beforeEach(function() {
        return makeSplashes.run(options);
      });

      it('calls splash task with passed source, passed platform, and projectPath', function() {
        expect(splashTaskOptions.source).to.equal(options.source);
        expect(splashTaskOptions.platforms).to.equal(options.platform);
        expect(splashTaskOptions.projectPath).to.equal('corber/cordova');
      });

      it('logs the command starting with passed platform', function() {
        td.verify(logger.info(`corber: Generating splashes for ${options.platform.join(', ')}`));
      });
    });
  });

  context('when no added platforms', function() {
    beforeEach(function() {
      td.replace('../../../lib/utils/get-added-platforms', function() {
        return [];
      });

      MakeSplashesCmd = require('../../../lib/commands/make-splashes');

      makeSplashes = new MakeSplashesCmd({
        project: mockProject.project,
        analytics: mockAnalytics
      });
    });

    context('when options and platform is `added`', function() {
      var options = {
        source: 'corber/splash.svg',
        platform: ['added']
      };

      it('throws an error', function() {
        expect(function() { makeSplashes.run(options) }).to.throw(Error);
      });
    });
  });
});
