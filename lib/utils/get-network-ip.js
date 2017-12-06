const os               = require('os');

module.exports = function getNetworkIp() {
  let interfaces = os.networkInterfaces();
  let addresses = [];

  for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
      let address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }

  // Default to 'localhost' when a suitable IP address isn't found.
  // This will allow live-reload emulators builds to function when
  // working without a network connection.
  return addresses[0] || 'localhost';
};
