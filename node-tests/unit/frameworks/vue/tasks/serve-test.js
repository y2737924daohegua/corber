const td             = require('testdouble');
const expect         = require('../../../../helpers/expect');
const Promise        = require('rsvp').Promise;
const isAnything     = td.matchers.anything;

describe('Vue Serve Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('constructs and runs a Bash Task', function() {
    let Bash = td.replace('../../../../../lib/tasks/bash');
    let Serve = require('../../../../../lib/frameworks/vue/tasks/serve');
    let tasks = [];

    td.replace(Bash.prototype, 'run', function() {
      tasks.push('bash-task');
      return Promise.resolve();
    });

    serveTask = new Serve();
    return serveTask.run().then(function() {
      td.verify(new Bash({
        command: 'npm run dev'
      }));

      expect(tasks).to.deep.equal([
        'bash-task'
      ]);
    });
  });
});
