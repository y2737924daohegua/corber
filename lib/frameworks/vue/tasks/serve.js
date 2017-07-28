const Task             = require('../../../tasks/-task');
const BashTask         = require('../../../tasks/bash');

module.exports = Task.extend({
  run() {
    let serve = new BashTask({
      command: 'npm run dev'
    });

    return serve.run();
  }
});
