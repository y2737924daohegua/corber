var td              = require('testdouble');
var childProcess    = require('child_process');

describe('Verify Cordova Installed Task', function() {
  var execDouble, verifyCmd;

  beforeEach(function() {
    execDouble = td.replace(childProcess, 'execSync');

    var VerifyTask = require('../../../../../lib/targets/cordova/validators/is-installed');

    verifyCmd = new VerifyTask({
      command: 'foo',
      options: {}
    });
  });

  afterEach(function() {
    td.reset();
  });

  it('attempts to exec cmd', function() {
    var expected = 'command -v cordova >/dev/null && ' +
      '{ echo >&1 \'command found\'; }';

    verifyCmd.run();
    td.verify(execDouble(expected));
  });
});
