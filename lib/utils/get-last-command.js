module.exports = function getLastCommand() {
  let args = Array.prototype.slice.call(process.argv);

  args.shift();
  args.shift();

  return 'ember ' + args.join(' ');
};
