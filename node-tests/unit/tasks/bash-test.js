'use strict';

const td      = require('testdouble');
const expect  = require('../../helpers/expect');
const path    = require('path');
const RSVP    = require('RSVP');

const workingPath = path.join('/', 'tmp');

describe('Bash Task', function() {
  let BashTask, bashTask;

  beforeEach(function() {
    let onStdout = td.function();
    let onStderr = td.function();

    let spawn = td.replace('../../../lib/utils/spawn');
    td.when(spawn('ls -l', [], { shell: true }, {
      onStdout,
      onStderr,
      cwd: workingPath
    })).thenReturn(RSVP.Promise.resolve(0));

    BashTask = require('../../../lib/tasks/bash');

    bashTask = new BashTask({
      command: 'ls -l',
      onStdout,
      onStderr,
      cwd: workingPath
    });
  });

  afterEach(function() {
    td.reset();
  });

  it('resolves on success with exit code 0', function() {
    return expect(bashTask.run()).to.eventually.equal(0);
  });
});
