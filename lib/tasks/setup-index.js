'use strict';

var Task            = require('./-task');
var cordovaPath     = require('../utils/cordova-path');
var path            = require('path');
var fsUtils         = require('../utils/fs-utils');
var HTMLParser      = require('htmlparser2').Parser;
var DomHandler      = require('htmlparser2').DomHandler;
var DomUtils        = require('htmlparser2').DomUtils;
var Promise         = require('rsvp').Promise;
var logger          = require('../utils/logger');

module.exports = Task.extend({
  source: undefined,
  project: undefined,

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
    var projectPath = cordovaPath(this.project);
    var indexPath = path.join(projectPath, this.source);

    logger.info('ember-cordova: Setting up ' + indexPath + '...\n');

    return fsUtils.read(indexPath).then(function(fileContents) {
      var dom = this.getDom(fileContents);

      if (this.scriptElementExists(dom)) return Promise.resolve();

      this.setupIndex(dom);

      return fsUtils.write(indexPath, DomUtils.getOuterHTML(dom));
    }.bind(this));
  }
});
