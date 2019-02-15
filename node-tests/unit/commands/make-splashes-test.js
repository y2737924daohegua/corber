const td                 = require('testdouble');
const CorberError        = require('../../../lib/utils/corber-error');
const path               = require('path');
const Promise            = require('rsvp').Promise;
const contains           = td.matchers.contains;

const mockProject        = require('../../fixtures/corber-mock/project');
const mockAnalytics      = require('../../fixtures/corber-mock/analytics');

const specifiedPlatforms = ['specified-platform', 'added'];
const expandedPlatforms  = ['specified-platform', 'added-platform'];

describe('Make Splashes Command', () => {
  let expandPlatforms;
  let splashTask;
  let logger;

  let makeSplashes;
  let options;

  beforeEach(() => {
    splashTask      = td.replace('splicon/src/splash-task');
    expandPlatforms = td.replace('../../../lib/commands/utils/expand-platforms');
    logger          = td.replace('../../../lib/utils/logger');

    td.when(expandPlatforms(mockProject.project, specifiedPlatforms))
      .thenReturn(Promise.resolve(expandedPlatforms))

    td.when(splashTask(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    let MakeSplashesCommand = require('../../../lib/commands/make-splashes');
    makeSplashes = new MakeSplashesCommand({
      project: mockProject.project
    });

    makeSplashes.analytics = mockAnalytics;

    options = {
      source: 'source',
      platform: specifiedPlatforms
    };
  });

  afterEach(() => {
    td.reset();
  });

  it('logs a starting message to info', () => {
    return makeSplashes.run(options).then(() => {
      td.verify(logger.info(contains('Generating splashes for specified-platform, added-platform')));
    })
  });

  it('passes expanded platforms to splashTask', () => {
    return makeSplashes.run(options).then(() => {
      let property = { platforms: ['specified-platform', 'added-platform'] };

      td.config({ ignoreWarnings: true });
      td.verify(splashTask(contains(property)));
      td.config({ ignoreWarnings: false });
    });
  });

  it('passes source to splashTask', () => {
    return makeSplashes.run(options).then(() => {
      let property = { source: 'source' };

      td.config({ ignoreWarnings: true });
      td.verify(splashTask(contains(property)));
      td.config({ ignoreWarnings: false });
    });
  });

  it('passes projectPath to splashTask', () => {
    return makeSplashes.run(options).then(() => {
      let property = { projectPath: path.join('corber', 'cordova') };

      td.config({ ignoreWarnings: true });
      td.verify(splashTask(td.matchers.contains(property)));
      td.config({ ignoreWarnings: false });
    });
  });

  it('logs a completion message to success', () => {
    return makeSplashes.run(options).then(() => {
      td.verify(logger.success(contains('splashes generated')))
    });
  });

  context('when expandPlatforms rejects', () => {
    beforeEach(() => {
      td.when(expandPlatforms(), { ignoreExtraArgs: true })
        .thenReturn(Promise.reject(new CorberError('expand-platforms-error')));
    });

    it('logs a message to error', () => {
      return makeSplashes.run(options).then(() => {
        td.verify(logger.error(contains('expand-platforms-error')))
      });
    });

    it('does not log a completion message to success', () => {
      return makeSplashes.run(options).then(() => {
        td.verify(logger.success(contains('splashes generated')), { times: 0 });
      });
    });
  });

  context('when splashTask rejects', () => {
    beforeEach(() => {
      td.when(splashTask(), { ignoreExtraArgs: true })
        .thenReturn(Promise.reject('splash-task-error'));
    });

    it('logs a message to error', () => {
      return makeSplashes.run(options).then(() => {
        td.verify(logger.error(contains('splash-task-error')))
      });
    });

    it('does not log a message to success', () => {
      return makeSplashes.run(options).then(() => {
        td.verify(logger.success(contains('splashes generated')), { times: 0 });
      });
    });
  });
});
