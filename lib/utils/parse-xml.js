const xml2js           = require('xml2js');
const Promise          = require('rsvp').Promise;

const fsUtils          = require('./fs-utils');
const logger           = require('./logger');

module.exports = function parseXML(xmlPath) {
  return new Promise(function(resolve, reject) {
    let contents = fsUtils.readSync(xmlPath, { encoding: 'utf8' });
    let parser = new xml2js.Parser();

    parser.parseString(contents, function (err, result) {
      if (err) {
        logger.error(err);
        return reject(err);
      }

      if (result) {
        resolve(result);
      }
    });
  });
};
