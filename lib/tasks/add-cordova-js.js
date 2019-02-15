const fsUtils         = require('../utils/fs-utils');
const HTMLParser      = require('htmlparser2').Parser;
const DomHandler      = require('htmlparser2').DomHandler;
const DomUtils        = require('htmlparser2').DomUtils;
const Promise         = require('rsvp').Promise;
const logger          = require('../utils/logger');

const getDom = function(fileContents) {
  let dom;
  let handler = new DomHandler(function(err, _dom) {
    if (err) { throw err }
    dom = _dom;
  });
  let parser = new HTMLParser(handler);

  parser.end(fileContents);

  return dom;
};

const scriptElementExists = function(dom) {
  return DomUtils.find(function(element) {
    return element.type === 'script' && element.attribs.src === 'cordova.js';
  }, dom, true, 1).length > 0;
};

const getBodyElement = function(dom) {
  return DomUtils.find(function(element) {
    return element.type === 'tag' && element.name === 'body';
  }, dom, true, 1)[0];
};

const createScriptElement = function() {
  return getDom('<script src="cordova.js"></script>')[0];
};

const prependChild = function(elem, child) {
  let firstChild = elem.children[0];
  DomUtils.prepend(firstChild, child);
};

const setupIndex = function(dom) {
  let bodyElement = getBodyElement(dom);
  let scriptElement = createScriptElement();
  prependChild(bodyElement, scriptElement);
};

module.exports = function(source) {
  logger.info(`Adding cordova.js to ${source}...\n`);

  return fsUtils.read(source).then((fileContents) => {
    let dom = getDom(fileContents);

    if (scriptElementExists(dom)) { return Promise.resolve(); }

    setupIndex(dom);

    return fsUtils.write(source, DomUtils.getOuterHTML(dom));
  });
};
