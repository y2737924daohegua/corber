const td             = require('testdouble');
const expect         = require('../../../../helpers/expect');
const Promise        = require('rsvp').Promise;
const isAnything     = td.matchers.anything;

describe('Vue Build Task', function() {
  let buildTask, tasks, Bash, AddCordovaJS;

  beforeEach(function() {
    tasks = [];

    Bash = td.replace('../../../../../lib/tasks/bash');
    AddCordovaJS = td.replace('../../../../../lib/tasks/add-cordova-js');
    let Build = require('../../../../../lib/frameworks/vue/tasks/build');

    td.replace(Bash.prototype, 'run', function() {
      tasks.push('bash-task');
      return Promise.resolve();
    });

    td.replace(Bash.prototype, 'prepare', function() {
      tasks.push('bash-task-2');
      return Promise.resolve();
    });

    td.replace(AddCordovaJS.prototype, 'prepare', function() {
      tasks.push('add-cordova-js');
      return Promise.resolve();
    });

    buildTask = new Build({
      buildCommand: 'fakeBuildCommand',
      buildPath: 'fakePath',
      cordovaOutputPath: 'fakeCordovaPath'
    });
  });

  afterEach(function() {
    td.reset();
  });

  it('runs tasks in the correct order', function() {
    return buildTask.run({cordovaOutputPath: 'fakePath'}).then(function() {
      expect(tasks).to.deep.equal([
        'bash-task',
        'bash-task-2',
        'add-cordova-js'
      ]);
    });
  });

  it('constructs tasks with the right params', function() {
    let captor = td.matchers.captor();
    buildTask.run({cordovaOutputPath: 'fakePath'});

    td.verify(new Bash(captor.capture()));
    td.verify(new AddCordovaJS({
      source: 'fakeCordovaPath/index.html'
    }));

    expect(captor.values[0].command).to.equal('fakeBuildCommand');
    expect(captor.values[1].command).to.equal('cp -R fakePath/* fakeCordovaPath');
  });
});
