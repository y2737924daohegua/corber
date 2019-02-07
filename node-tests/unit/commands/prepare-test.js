const td              = require('testdouble');
const expect          = require('../../helpers/expect');
const Promise         = require('rsvp').Promise;

const mockProject     = require('../../fixtures/corber-mock/project');
const mockAnalytics   = require('../../fixtures/corber-mock/analytics');

describe('Prepare Command', () => {
  let PrepareTask;
  let opts;

  let setupTaskTracking = (tasks) => {
    let stubTask = (id, returnValue) => {
      return (...args) => {
        let label = typeof (id) === 'function' ? id(...args) : id;
        tasks.push(label);
        return Promise.resolve(returnValue);
      }
    };

    td.replace('../../../lib/tasks/run-hook', stubTask((name) => `hook ${name}`));
    td.replace(PrepareTask.prototype, 'run', stubTask('prepare'));
  };

  let setupCommand = () => {
    let PrepareCommand = require('../../../lib/commands/prepare');

    let prepare = new PrepareCommand({
      project: mockProject.project
    });

    prepare.analytics = mockAnalytics;

    return prepare;
  };

  beforeEach(() => {
    td.replace('../../../lib/tasks/run-hook');

    PrepareTask = td.replace('../../../lib/targets/cordova/tasks/prepare');

    opts = {};
  });

  afterEach(() => {
    td.reset();
  });

  it('runs tasks in the correct order', () => {
    let tasks = [];

    setupTaskTracking(tasks);

    let prepare = setupCommand();

    return prepare.run(opts).then(() => {
      ////h-t ember-electron for the pattern
      expect(tasks).to.deep.equal([
        'hook beforePrepare',
        'prepare',
        'hook afterPrepare'
      ]);
    });
  });
});
