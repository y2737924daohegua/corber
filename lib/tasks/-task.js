const Task             = require('ember-cli/lib/models/task');

module.exports = Task.extend({
  prepare() {
    let task = this;
    let args = Array.prototype.slice.call(arguments);

    return function preparedTask() {
      return task.run.apply(task, args);
    };
  }
});
