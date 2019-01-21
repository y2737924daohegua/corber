const expect          = require('../../helpers/expect');
const HookTask        = require('../../../lib/tasks/run-hook');
const mockProject     = require('../../fixtures/corber-mock/project');
const Promise         = require('rsvp').Promise;

describe('Run Hook Task', () => {
  it('runs a hook at the provided path', () => {
    let hookTask = new HookTask(mockProject);
    return expect(hookTask.run('hook')).to.be.fulfilled;
  });

  it('passes options to the hook', () => {
    let options = {foo: true};
    let hookTask = new HookTask(mockProject);
    let taskRun = hookTask.run('hook-with-options', options);
    return expect(taskRun).to.become(options);
  });

  it('runs a hook at the provided path that has an error', () => {
    let hookTask = new HookTask(mockProject);
    return expect(hookTask.run('hook-with-error')).to.eventually.be.rejected;
  });

  it('is resolved if the hook is resolved', () => {
    let hookTask = new HookTask(mockProject);
    let expectation = expect(hookTask.run('hook-promise-resolved'));
    return Promise.all([
      expectation.to.eventually.equal('resolved promise from hook'),
      expectation.to.eventually.be.fulfilled,
    ]);
  });

  it('is rejected if the hook is rejected', () => {
    let hookTask = new HookTask(mockProject);
    let expectation = expect(hookTask.run('hook-promise-rejected'));
    return Promise.all([
      expectation.to.eventually.equal('hook rejected'),
      expectation.to.eventually.be.rejected,
    ]);
  });
});
