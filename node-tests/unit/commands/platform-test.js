const td              = require('testdouble');
const expect          = require('../../helpers/expect');
const Promise         = require('rsvp').Promise;

const mockProject     = require('../../fixtures/corber-mock/project');
const mockAnalytics   = require('../../fixtures/corber-mock/analytics');

describe('Platform Command', () => {
  let AddonArgsValidator;
  let PlatformTask;
  let HookTask;
  let logger;

  let platform;
  let opts;
  let rawArgs;

  let tasks;

  let stubTask = (id, returnValue) => {
    return (...args) => {
      let label = typeof (id) === 'function' ? id(...args) : id;
      tasks.push(label);
      return Promise.resolve(returnValue);
    }
  };

  beforeEach(() => {
    AddonArgsValidator = td.replace('../../../lib/targets/cordova/validators/addon-args');
    PlatformTask       = td.replace('../../../lib/targets/cordova/tasks/platform');
    HookTask           = td.replace('../../../lib/tasks/run-hook');
    logger             = td.replace('../../../lib/utils/logger');

    let PlatformCmd    = require('../../../lib/commands/platform');

    platform = new PlatformCmd({
      project: mockProject.project
    });

    platform.analytics = mockAnalytics;

    opts = {};
    rawArgs = [];
  });

  afterEach(() => {
    td.reset();
  });

  it('logs error if validator returns unsupported platform', () => {
    td.when(AddonArgsValidator.prototype.run())
      .thenReturn(Promise.resolve({ action: 'add', name: 'foo' }))

    return platform.run(opts, rawArgs).then(() => {
      td.verify(logger.error('\'foo\' is not a supported platform'));
    });
  });

  it('logs error if validator returns no platform', () => {
    td.when(AddonArgsValidator.prototype.run())
      .thenReturn(Promise.resolve({ action: 'add', name: undefined }))

    return platform.run(opts, rawArgs).then(() => {
      td.verify(logger.error('no platform specified'));
    });
  });

  describe('add platform action', () => {
    beforeEach(() => {
      td.when(AddonArgsValidator.prototype.run())
        .thenReturn(Promise.resolve({ action: 'add', name: 'ios' }));

      rawArgs = ['platform', 'add', 'ios'];
    });

    it('logs action to info', () => {
      return platform.run(opts, rawArgs).then(() => {
        td.verify(logger.info('adding platform \'ios\'...'));
      });
    });

    it('logs success on completion', () => {
      return platform.run(opts, rawArgs).then(() => {
        td.verify(logger.success('added platform \'ios\''));
      });
    });

    it('calls platformTask.run()', () => {
      return platform.run(opts, rawArgs).then(() => {
        td.verify(PlatformTask.prototype.run('add', 'ios', opts));
      });
    });

    it('performs tasks in correct order', () => {
      td.replace(AddonArgsValidator.prototype, 'run', stubTask('validate args', { action: 'add', name: 'ios' }));
      td.replace(PlatformTask.prototype, 'run', stubTask('add platform ios'));
      td.replace(HookTask.prototype, 'run', stubTask((name) => `hook ${name}`));

      tasks = [];

      return platform.run(opts, rawArgs).then(() => {
        expect(tasks).to.deep.equal([
          'validate args',
          'hook beforePlatformAdd',
          'add platform ios',
          'hook afterPlatformAdd'
        ]);
      });
    })
  });

  describe('remove platform action', () => {
    beforeEach(() => {
      td.when(AddonArgsValidator.prototype.run())
        .thenReturn(Promise.resolve({ action: 'remove', name: 'android' }));

      rawArgs = ['platform', 'remove', 'android'];
    });

    it('logs action to info', () => {
      return platform.run(opts, rawArgs).then(() => {
        td.verify(logger.info('removing platform \'android\'...'));
      });
    });

    it('logs success on completion', () => {
      return platform.run(opts, rawArgs).then(() => {
        td.verify(logger.success('removed platform \'android\''));
      });
    });

    it('calls platformTask.run()', () => {
      return platform.run(opts, rawArgs).then(() => {
        td.verify(PlatformTask.prototype.run('remove', 'android', opts));
      });
    });

    it('performs tasks in correct order', () => {
      td.replace(AddonArgsValidator.prototype, 'run', stubTask('validate args', { action: 'remove', name: 'android' }));
      td.replace(PlatformTask.prototype, 'run', stubTask('remove platform android'));
      td.replace(HookTask.prototype, 'run', stubTask((name) => `hook ${name}`));

      tasks = [];

      return platform.run(opts, rawArgs).then(() => {
        expect(tasks).to.deep.equal([
          'validate args',
          'hook beforePlatformRemove',
          'remove platform android',
          'hook afterPlatformRemove'
        ]);
      });
    });
  });
});
