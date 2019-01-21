const HTMLParser       = require('htmlparser2').Parser;
const Promise          = require('rsvp').Promise;
const fsUtils          = require('../utils/fs-utils');
const logger           = require('../utils/logger');

const ROOT_URL_PATTERN = /^\//;
const NEW_LINE_PATTERN = /\n/g;

const getPathAttributes = (fileContents) => {
  return new Promise(function(resolve, reject) {
    let attributes = [];
    let line = 1;

    let parser = new HTMLParser({
      ontext(text) {
        let matches = text.match(NEW_LINE_PATTERN);
        if (matches) { line += matches.length; }
      },
      onopentag(name, attrs) {
        if (attrs.src) {
          attributes.push({
            tagName: name,
            name: 'src',
            value: attrs.src,
            line: line
          });
        }

        if (attrs.href) {
          attributes.push({
            tagName: name,
            name: 'href',
            value: attrs.href,
            line: line
          });
        }
      },
      onend() {
        return resolve(attributes);
      }
    }, {decodeEntities: true});

    parser.end(fileContents);
  });
};

const validate = (attributes) => {
  return attributes.filter(function(attribute) {
    return ROOT_URL_PATTERN.test(attribute.value);
  });
};

const print = (path, warnings) => {
  if (warnings.length === 0) {
    return logger.success('0 problems');
  }

  let msg = '\n' + path + '\n';
  msg += 'There are remaining paths beginning with / in your code. ';
  msg += 'They likely will not work.';

  warnings.forEach(function(w) {
    msg += '  Line ' + w.line + '  ' +
      w.name + '-attribute contains unsupported path relative to root: ' +
      w.value + '\n';
  });

  msg += '\n' + '✖ ' + warnings.length + ' problem(s)';

  logger.warn(msg);
};

module.exports = function(source) {
  let indexPath = source;

  logger.info(`Linting ${indexPath}...\n`);

  return fsUtils.read(indexPath).then((fileContents) => {
    return getPathAttributes(fileContents).then((attributes) => {
      let warnings = validate(attributes);

      print(indexPath, warnings);

      return Promise.resolve(warnings);
    });
  });
};
