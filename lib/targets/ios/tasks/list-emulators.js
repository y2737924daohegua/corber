const Task            = require('../../../tasks/-task');
const spawn           = require('../../../utils/spawn');
const IOSEmulator     = require('../../../objects/emulator/ios');

module.exports = Task.extend({
  deserializeEmulators(iosVersion, list) {
    let emulators = [];
    if (list === undefined) { return emulators; }

    let items = list.split('\n');
    items.forEach((item) => {
      if (item.trim() === '') { return; }
      let split = item.replace(/\)/g, '').split('(');
      let emulator = new IOSEmulator({
        platform: 'ios',
        apiVersion: iosVersion,
        name: split[0].trim(),
        uuid: split[split.length - 2].trim(),
        state: split[split.length - 1].trim()
      })
      emulators.push(emulator);
    });

    return emulators;
  },

  run() {
    let list = [
      '/usr/bin/xcrun',
      ['simctl', 'list', 'devices']
    ];

    return spawn.apply(null, list).then((found) => {
      let emulators = [];

      let listedEmulators = found.split(/(iOS \d+.\d+ --)([\s\S]*?)--/);
      listedEmulators.forEach((list, i) => {
        if (/iOS \d+.\d+ --/.test(list)) {
          let iosV = list.split(' ')[1];
          let found = this.deserializeEmulators(iosV, listedEmulators[i + 1]);
          emulators = emulators.concat(found);
        }
      });

      return emulators.reverse();
    });
  }
});
