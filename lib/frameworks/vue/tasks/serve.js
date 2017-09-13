const Task             = require('../../../tasks/-task');
const Bash             = require('../../../tasks/bash');

module.exports = Task.extend({
  run(platform) {
    let serve = new Bash({
      command: `node build/dev-server.js --CORBER_PLATFORM=${platform}`
    });

    return serve.run();
  }
});
