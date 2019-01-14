const spawn           = require('../../../utils/spawn');
const Device          = require('../../../objects/device');

const deserializeDevices = function(stdout) {
  let devices = [];
  if (stdout === undefined) { return devices; }

  let list = stdout.split('\n');
  //First line is always 'known devices'
  list.shift();

  list.forEach((item) => {
    if (item.trim() === '') { return; }
    let split = item.split(/[(]|[[]/g);

    if (split[split.length - 1].includes('Simulator')) {
      return;
    }

    let deviceName = split[0].trim();
    //Cant exclude from instruments
    if (deviceName.includes('MacBook')) {
      return;
    }

    let apiVersion = split[1].replace(')', '').trim();
    let uuid = split[split.length - 1].replace(']', '').trim();

    let device = new Device({
      platform: 'ios',
      deviceType: 'device',
      apiVersion: apiVersion,
      name: deviceName,
      uuid: uuid
    });

    devices.push(device);
  });

  return devices;
};

module.exports = function() {
  let list = [
    '/usr/bin/instruments',
    ['-s','devices']
  ];

  return spawn(...list).then((output) => {
    let devices = deserializeDevices(output.stdout);
    return devices.reverse();
  });
};
