const Task            = require('./-task');
const fsUtils         = require('../utils/fs-utils');
const HTMLParser      = require('htmlparser2').Parser;
const DomHandler      = require('htmlparser2').DomHandler;
const DomUtils        = require('htmlparser2').DomUtils;
const Promise         = require('rsvp').Promise;
const logger          = require('../utils/logger');

module.exports = Task.extend({
  source: undefined,

  getDom(fileContents) {
    let dom;
    let handler = new DomHandler(function(err, _dom) {
      if (err) { throw err }
      dom = _dom;
    });
    let parser = new HTMLParser(handler);

    parser.end(fileContents);

    return dom;
  },

  scriptElementExists(dom) {
    return DomUtils.find(function(element) {
      return element.type === 'script' && element.attribs.src === 'cordova.js';
    }, dom, true, 1).length > 0;
  },

  getBodyElement(dom) {
    return DomUtils.find(function(element) {
      return element.type === 'tag' && element.name === 'body';
    }, dom, true, 1)[0];
  },

  createScriptElement() {
    return this.getDom('<script src="cordova.js"></script>')[0];
  },

  prependChild(elem, child) {
    let firstChild = elem.children[0];
    DomUtils.prepend(firstChild, child);
  },

  setupIndex(dom) {
    let bodyElement = this.getBodyElement(dom);
    let scriptElement = this.createScriptElement();
    this.prependChild(bodyElement, scriptElement);
  },

  run() {
    logger.info('corber: Setting up ' + this.source + '...\n');

    return fsUtils.read(this.source).then((fileContents) => {
      let dom = this.getDom(fileContents);

      if (this.scriptElementExists(dom)) { return Promise.resolve(); }

      this.setupIndex(dom);

      return fsUtils.write(this.source, DomUtils.getOuterHTML(dom));
    });
  }
});
