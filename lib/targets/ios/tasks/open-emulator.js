const spawn           = require('../../../utils/spawn');

module.exports = function() {
  let open = [
    'open',
    ['/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app']
  ];

  return spawn(...open);
};
