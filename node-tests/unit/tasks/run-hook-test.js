const td              = require('testdouble');
const expect          = require('../../helpers/expect');
const mockProject     = require('../../fixtures/corber-mock/project');
const path            = require('path');

const root            = mockProject.project.root;
const corberPath      = path.join(root, 'corber');
const hookPath        = path.join(corberPath, 'hooks', 'hook');

describe('Run Hook Task', () => {
  let fsUtils;
  let logger;
  let getCordovaPath;

  let hook;
  let opts;
  let hookOpts;

  let requireTask = () => require('../../../lib/tasks/run-hook');

  beforeEach(() => {
    fsUtils        = td.replace('../../../lib/utils/fs-utils');
    logger         = td.replace('../../../lib/utils/logger');
    getCordovaPath = td.replace('../../../lib/targets/cordova/utils/get-path');
    hook           = td.replace(hookPath);

    td.when(getCordovaPath({ root }, true)).thenReturn(corberPath);
    td.when(fsUtils.existsSync(`${hookPath}.js`)).thenReturn(true);

    opts = {
      root
    };

    hookOpts = {};
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves on completion', () => {
    let runHook = requireTask();
    return expect(runHook('hook', hookOpts, opts)).to.eventually.be.fulfilled;
  });

  it('calls hook with passed options', () => {
    let runHook = requireTask();
    let hookOpts = { foo: true };

    return runHook('hook', hookOpts, opts).then(() => {
      td.verify(hook(hookOpts));
    });
  });

  it('logs a hook-loading message to info', () => {
    let runHook = requireTask();
    return runHook('hook', hookOpts, opts).then(() => {
      td.verify(logger.info('Located hook \'hook\''));
    });
  });

  it('logs to success on completion', () => {
    let runHook = requireTask();
    return runHook('hook', hookOpts, opts).then(() => {
      td.verify(logger.success('Executed hook \'hook\''));
    });
  });

  context('when hook does not exist', () => {
    let runHook;

    beforeEach(() => {
      td.when(fsUtils.existsSync(`${hookPath}.js`)).thenReturn(false);
      runHook = requireTask();
    });

    it('still resolves', () => {
      return expect(runHook('hook', hookOpts, opts))
        .to.eventually.be.fulfilled;
    });

    it('does not log an error', () => {
      return runHook('hook', hookOpts, opts).then(() => {
        td.verify(logger.error(td.matchers.anything), { times: 0 });
      });
    });

    it('does not log a success message', () => {
      return runHook('hook', hookOpts, opts).then(() => {
        td.verify(logger.success(), { ignoreExtraArgs: true, times: 0 });
      });
    });
  });

  context('when hook returns a resolved promise', () => {
    let runHook;

    beforeEach(() => {
      td.replace(hookPath, () => Promise.resolve('resolved'));
      runHook = requireTask();
    });

    it('resolves to same value', () => {
      return expect(runHook('hook', hookOpts, opts))
        .to.eventually.equal('resolved');
    });
  });

  context('when hook throws an exception', () => {
    let runHook;

    beforeEach(() => {
      td.replace(hookPath, () => {
        throw 'error';
      });

      runHook = requireTask();
    });

    it('rejects with same error', () => {
      return expect(runHook('hook', hookOpts, opts))
        .to.eventually.be.rejectedWith('error');
    });

    it('logs an error', () => {
      return runHook('hook', hookOpts, opts).catch((e) => {
        td.verify(logger.error('Hook \'hook\' exited with exception: error'));
      });
    });
  });

  context('when hook returns a rejected promise', () => {
    let runHook;

    beforeEach(() => {
      td.replace(hookPath, () => Promise.reject('hook rejected'));
      runHook = requireTask();
    });

    it('logs an error', () => {
      return runHook('hook', hookOpts, opts).catch((e) => {
        td.verify(logger.error('Hook \'hook\' exited with rejection: hook rejected'));
      });
    });

    it('rejects with rejected value', () => {
      td.replace(hookPath, () => Promise.reject('hook rejected'));
      return expect(runHook('hook', hookOpts, opts))
        .to.eventually.be.rejectedWith('hook rejected');
    });
  });
});
