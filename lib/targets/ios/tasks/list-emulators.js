const spawn           = require('../../../utils/spawn');
const Device          = require('../../../objects/device');

const deserializeEmulators = function(iosVersion, list) {
  let emulators = [];
  if (list === undefined) { return emulators; }

  let items = list.split('\n');
  items.forEach((item) => {
    if (item.trim() === '') { return; }
    let split = item.replace(/\)/g, '').split('(');
    let emulator = new Device({
      platform: 'ios',
      deviceType: 'emulator',
      apiVersion: iosVersion,
      name: split[0].trim(),
      uuid: split[split.length - 2].trim(),
      state: split[split.length - 1].trim()
    })
    emulators.push(emulator);
  });

  return emulators;
};

module.exports = function() {
  let list = [
    '/usr/bin/xcrun',
    ['simctl', 'list', 'devices']
  ];

  return spawn(...list).then((result) => {
    let listedEmulators = result.stdout.split(/(iOS \d+.\d+ --)([\s\S]*?)--/);
    let emulators = listedEmulators.reduce((arr, list, i) => {
      if (/iOS \d+.\d+ --/.test(list)) {
        let iosV = list.split(' ')[1];
        let found = deserializeEmulators(iosV, listedEmulators[i + 1]);
        arr.push(...found);
      }
      return arr;
    }, []);

    return emulators.reverse();
  });
};
