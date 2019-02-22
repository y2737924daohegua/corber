const td             = require('testdouble');
const expect         = require('../../helpers/expect');
const Promise        = require('rsvp').Promise;

let tasks, Bash, fsArgs;

const setupBuild = function(stubFs) {
  tasks = [];
  fsArgs = [];

  td.replace('../../../lib/utils/fs-utils', {
    empty: function(path) {
      tasks.push('empty-dir');
      fsArgs.push(path);
      return Promise.resolve();
    },

    copyDir: function(source, dest) {
      tasks.push('copy-dir');
      fsArgs.push(`${source} ${dest}`);
      return Promise.resolve();
    }
  });

  td.replace('../../../lib/utils/create-gitkeep', function() {
    tasks.push('create-gitkeep');
    return Promise.resolve();
  });

  Bash = td.replace('../../../lib/tasks/bash');
  let Build = require('../../../lib/tasks/bash-build');

  td.replace(Bash.prototype, 'run', function() {
    tasks.push('bash-task');
    return Promise.resolve();
  });

  return new Build({
    buildCommand: 'fakeBuildCommand',
    buildPath: 'fakePath',
    cordovaOutputPath: 'fakeCordovaPath'
  });
}


describe('Bash Build Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('runs tasks in the correct order', function() {
    let buildTask = setupBuild();

    return buildTask.run({cordovaOutputPath: 'fakePath'}).then(function() {
      expect(tasks).to.deep.equal([
        'empty-dir',
        'create-gitkeep',
        'bash-task',
        'copy-dir'
      ]);
    });
  });

  it('constructs tasks with the right params', function() {
    let buildTask = setupBuild();

    let captor = td.matchers.captor();
    return buildTask.run({cordovaOutputPath: 'fakePath'}).then(function() {
      td.verify(new Bash(captor.capture()));
      expect(captor.values[0].command).to.equal('fakeBuildCommand');
      expect(fsArgs[0]).to.equal('fakeCordovaPath');
      expect(fsArgs[1]).to.equal('fakePath fakeCordovaPath');
    });
  });
});
