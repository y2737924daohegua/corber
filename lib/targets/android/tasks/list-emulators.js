const Task            = require('../../../tasks/-task');
const spawn           = require('../../../utils/spawn');
const path            = require('path');

module.exports = Task.extend({
  //TODO
  //- Migrate GUI user path/sdk path pattern
  run() {
    let home = process.env['HOME'];
    let list = [
      path.join(home, 'Library/Android/sdk/tools/emulator'),
      ['emulator', '-list-avds']
    ];

    return spawn.apply(null, list).then((found) => {
      let emulators = [];

      let listedEmulators = found.split('\n');
      listedEmulators.forEach((emulator, i) => {
        if (emulator && emulator !== '') {
          emulators.push({
            name: emulator
          });
        }
      });

      return emulators.reverse();
    });
  }
});
