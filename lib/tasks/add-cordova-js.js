'use strict';

var Task            = require('./-task');
var cordovaPath     = require('../targets/cordova/utils/get-path');
var path            = require('path');
var fsUtils         = require('../utils/fs-utils');
var HTMLParser      = require('htmlparser2').Parser;
var DomHandler      = require('htmlparser2').DomHandler;
var DomUtils        = require('htmlparser2').DomUtils;
var Promise         = require('rsvp').Promise;
var logger          = require('../utils/logger');

module.exports = Task.extend({
  source: undefined,

  getDom: function(fileContents) {
    var dom;
    var handler = new DomHandler(function(err, _dom) {
      if (err) throw err;
      dom = _dom;
    });
    var parser = new HTMLParser(handler);

    parser.end(fileContents);

    return dom;
  },

  scriptElementExists: function(dom) {
    return DomUtils.find(function(element) {
      return element.type === 'script' && element.attribs.src === 'cordova.js';
    }, dom, true, 1).length > 0;
  },

  getBodyElement: function(dom) {
    return DomUtils.find(function(element) {
      return element.type === 'tag' && element.name === 'body';
    }, dom, true, 1)[0];
  },

  createScriptElement: function() {
    return this.getDom('<script src="cordova.js"></script>')[0];
  },

  prependChild: function(elem, child) {
    var firstChild = elem.children[0];
    DomUtils.prepend(firstChild, child);
  },

  setupIndex: function(dom) {
    var bodyElement = this.getBodyElement(dom);
    var scriptElement = this.createScriptElement();
    this.prependChild(bodyElement, scriptElement);
  },

  run: function() {
    logger.info('ember-cordova: Setting up ' + this.source + '...\n');

    return fsUtils.read(this.source).then(function(fileContents) {
      var dom = this.getDom(fileContents);

      if (this.scriptElementExists(dom)) return Promise.resolve();

      this.setupIndex(dom);

      return fsUtils.write(this.source, DomUtils.getOuterHTML(dom));
    }.bind(this));
  }
});
