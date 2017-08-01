const Task             = require('../../../tasks/-task');
const Bash             = require('../../../tasks/bash');

module.exports = Task.extend({
  run() {
    let serve = new Bash({
      command: 'npm run dev'
    });

    return serve.run();
  }
});
