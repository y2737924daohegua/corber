const td                 = require('testdouble');
const CorberError        = require('../../../lib/utils/corber-error');
const path               = require('path');
const Promise            = require('rsvp').Promise;
const contains           = td.matchers.contains;

const mockProject        = require('../../fixtures/corber-mock/project');
const mockAnalytics      = require('../../fixtures/corber-mock/analytics');

const specifiedPlatforms = ['specified-platform', 'added'];
const expandedPlatforms  = ['specified-platform', 'added-platform'];

describe('Make Icons Command', () => {
  let expandPlatforms;
  let iconTask;
  let logger;

  let makeIcons;
  let options;

  beforeEach(() => {
    iconTask        = td.replace('splicon/src/icon-task');
    expandPlatforms = td.replace('../../../lib/commands/utils/expand-platforms');
    logger          = td.replace('../../../lib/utils/logger');

    td.when(expandPlatforms(mockProject.project, specifiedPlatforms))
      .thenReturn(Promise.resolve(expandedPlatforms))

    td.when(iconTask(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    let MakeIconsCommand = require('../../../lib/commands/make-icons');
    makeIcons = new MakeIconsCommand({
      project: mockProject.project
    });

    makeIcons.analytics = mockAnalytics;

    options = {
      source: 'source',
      platform: specifiedPlatforms
    };
  });

  afterEach(() => {
    td.reset();
  });

  it('logs a starting message to info', () => {
    return makeIcons.run(options).then(() => {
      td.verify(logger.info(contains('Generating icons for specified-platform, added-platform')));
    })
  });

  it('passes expanded platforms to iconTask', () => {
    return makeIcons.run(options).then(() => {
      let property = { platforms: ['specified-platform', 'added-platform'] };

      td.config({ ignoreWarnings: true });
      td.verify(iconTask(contains(property)));
      td.config({ ignoreWarnings: false });
    });
  });

  it('passes source to iconTask', () => {
    return makeIcons.run(options).then(() => {
      let property = { source: 'source' };

      td.config({ ignoreWarnings: true });
      td.verify(iconTask(contains(property)));
      td.config({ ignoreWarnings: false });
    });
  });

  it('passes projectPath to iconTask', () => {
    return makeIcons.run(options).then(() => {
      let property = { projectPath: path.join('corber', 'cordova') };

      td.config({ ignoreWarnings: true });
      td.verify(iconTask(contains(property)));
      td.config({ ignoreWarnings: false });
    });
  });

  it('logs a completion message to success', () => {
    return makeIcons.run(options).then(() => {
      td.verify(logger.success(contains('icons generated')))
    });
  });

  context('when expandPlatforms rejects', () => {
    beforeEach(() => {
      td.when(expandPlatforms(), { ignoreExtraArgs: true })
        .thenReturn(Promise.reject(new CorberError('expand-platforms-error')));
    });

    it('logs a message to error', () => {
      return makeIcons.run(options).then(() => {
        td.verify(logger.error(contains('expand-platforms-error')))
      });
    });

    it('does not log a completion message to success', () => {
      return makeIcons.run(options).then(() => {
        td.verify(logger.success(contains('icons generated')), { times: 0 });
      });
    });
  });

  context('when iconTask rejects', () => {
    beforeEach(() => {
      td.when(iconTask(), { ignoreExtraArgs: true })
        .thenReturn(Promise.reject('icon-task-error'));
    });

    it('logs a message to error', () => {
      return makeIcons.run(options).then(() => {
        td.verify(logger.error(contains('icon-task-error')))
      });
    });

    it('does not log a message to success', () => {
      return makeIcons.run(options).then(() => {
        td.verify(logger.success(contains('icons generated')), { times: 0 });
      });
    });
  });
});
