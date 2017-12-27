'use strict';

var expect          = require('../../helpers/expect');
var td              = require('testdouble');
var Command         = require('../../../lib/commands/-command');
var mockProject     = require('../../fixtures/corber-mock/project');
var mockAnalytics   = require('../../fixtures/corber-mock/analytics');
var isAnything      = td.matchers.anything();

describe('Command', function() {
  afterEach(function() {
    td.reset();
  });

  var setupCmd = function() {
    return new Command({
      project: mockProject.project
    });
  };

  it('creates an analytics object on init', function() {
    var cmd = setupCmd();
    expect(cmd.analytics).not.to.be.null;
  });

  it('sets uuid if none exists', function(done) {
    td.replace(Command.prototype, 'getUUID', function() {
      done();
      return 'name';
    });
    var cmd = setupCmd();
    cmd.analytics = mockAnalytics;

    cmd.run();
  });

  it('tracks commands', function() {
    var cmd = setupCmd();
    var trackDouble = td.replace(mockAnalytics, 'track');
    cmd.analytics = { track: trackDouble };

    cmd.run();
    td.verify(trackDouble(isAnything));
  });

  it('sets process.env.CORBER', function() {
    setupCmd();
    expect(process.env.CORBER).to.be.ok;
  });
});

