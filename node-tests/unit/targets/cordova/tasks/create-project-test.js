 /* eslint-disable max-len */
var td              = require('testdouble');

var fsUtils         = require('../../../../../lib/utils/fs-utils');
var logger          = require('../../../../../lib/utils/logger');

var cordovaProj     = require('cordova-lib').cordova;
var mockProject     = require('../../../../fixtures/ember-cordova-mock/project');
var isObject        = td.matchers.isA(Object);
var isString        = td.matchers.isA(String);
var contains        = td.matchers.contains;
 /* eslint-enable max-len */

describe('Cordova Create Project Task', function() {
  var create, rawDouble;

  var setupCreateTask = function() {
    //TODO - factor me out
    rawDouble = td.replace(cordovaProj.raw, 'create');

    /* eslint-disable max-len */
    var CreateCdvTask = require('../../../../../lib/targets/cordova/tasks/create-project');
    /* eslint-enable max-len */
    create = new CreateCdvTask(mockProject);
  };

  beforeEach(function() {
    td.replace(fsUtils, 'existsSync', function() {
      return false;
    });
  });

  afterEach(function() {
    td.reset();
  });


  it('calls cordova.create.raw', function() {
    setupCreateTask();
    create.run();
    td.verify(rawDouble(isString, isString, isString, isObject));
  });

  it('forces camelcased ids and names', function() {
    setupCreateTask();
    create.id = 'ember-cordova-app';
    create.name = 'ember-cordova-app';

    create.run();

    /* eslint-disable max-len */
    td.verify(rawDouble(isString, 'emberCordovaApp', 'emberCordovaApp', isObject));
    /* eslint-enable max-len */
  });

  it('raises a warning if cordova project already exists', function() {
    // We can't replace existsSync again here without resetting the previous
    // replacement from beforeEach. Doing so will store the beforeEach
    // version as the "real" function and leak into other tests.
    td.reset();
    td.replace(fsUtils, 'existsSync', function() {
      return true;
    });
    var logDouble = td.replace(logger, 'warn');

    setupCreateTask();
    return create.run().then(function() {
      td.verify(logDouble(contains('dir already exists')));
    });
  });

  it('defaults to the ember-cordova-template template', function() {
    setupCreateTask();
    create.run();

    var matcher = td.matchers.contains({
      lib: {
        www: {
          url: 'ember-cordova-template'
        }
      }
    });

    td.verify(rawDouble(isString, isString, isString, matcher));
  });

  it('builds with a template when provided', function() {
    setupCreateTask();
    create.templatePath = 'templatePath';
    create.run();

    var matcher = td.matchers.contains({lib: { www: { url: 'templatePath'}}});
    td.verify(rawDouble(isString, isString, isString, matcher));
  });
});
