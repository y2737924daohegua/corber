const Device          = require('../../../objects/device');
const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');

const deserializeDevices = function(list) {
  let devices = [];
  if (list === undefined) { return devices; }

  let items = list.split('\n');
  items = items.splice(1, items.length - 1);

  items.forEach((item) => {
    if (item.trim() === '') { return; }

    let device = new Device({
      name: item.split('model:')[1].split(' ')[0],
      uuid: item.split(' ')[0],
      deviceType: 'device',
      platform: 'android'
    });

    devices.push(device);
  });

  return devices;
};

module.exports = function() {
  let adbPath = sdkPaths().adb;

  let list = [
    adbPath,
    ['devices', '-l']
  ];

  return spawn(...list).then((result) => {
    let devices = deserializeDevices(result.stdout);
    return devices.reverse();
  });
};
