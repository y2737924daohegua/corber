const CorberError = function(content) {
  let message = content.message ? content.message : content;
  let stack = content.stack ? content.stack : (new Error()).stack;

  this.name = 'CorberError';
  this.message = message;
  this.stack = stack.substr(stack.indexOf('\n') + 1);
};

CorberError.prototype = Object.create(Error.prototype);
CorberError.prototype.toString = function() {
  return `${this.message}`;
};
CorberError.constructor = CorberError;

module.exports = CorberError;
