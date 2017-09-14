const td             = require('testdouble');
const expect         = require('../../helpers/expect');
const Promise        = require('rsvp').Promise;

describe('Vue Serve Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('constructs and runs a Bash Task', function() {
    let Bash = td.replace('../../../lib/tasks/bash');
    let Serve = require('../../../lib/tasks/bash-serve');
    let tasks = [];

    td.replace(Bash.prototype, 'run', function() {
      tasks.push('bash-task');
      return Promise.resolve();
    });

    let serveTask = new Serve({
      command: 'node build/dev-server.js',
      platform: 'ios'
    });
    return serveTask.run('ios').then(function() {
      td.verify(new Bash({
        command: 'node build/dev-server.js --CORBER_PLATFORM=ios'
      }));

      expect(tasks).to.deep.equal([
        'bash-task'
      ]);
    });
  });
});
