const td             = require('testdouble');
const expect         = require('../../helpers/expect');
const mockProject    = require('../../fixtures/ember-cordova-mock/project');
const Promise        = require('rsvp');
const GitIgnore      = require('../../../lib/tasks/update-gitignore');
let CreateCordova    = require('../../../lib/targets/cordova/tasks/create-project');

const isAnything     = td.matchers.anything;
const fsUtils        = require('../../../lib/utils/fs-utils');
const path           = require('path');
const frameworkType  = require('../../../lib/utils/framework-type');
const contains       = td.matchers.contains;
const requireFramework = require('../../../lib/utils/require-framework');

describe('Create Project', function() {
  let createTask;
  let project = mockProject.project;
  let ui = mockProject.ui;
  let tasks;

  function initTask(mockInitDirs = true) {
    tasks = [];

    td.replace('../../../lib/utils/require-framework', function() {
      return {
        afterInstall() {
          tasks.push('framework-after-install');
          return Promise.resolve();
        }
      }
    });

    let CreateProject = require('../../../lib/tasks/create-project');

    createTask = new CreateProject({
      project: mockProject.project,
      ui: mockProject.ui,
      cordovaId: 'com.embercordova.app',
      name: 'com.emberCordova.app'
    });

    td.replace(CreateCordova.prototype, 'run', function() {
      tasks.push('create-cordova-project');
      return Promise.resolve();
    });

    td.replace(GitIgnore.prototype, 'run', function() {
      tasks.push('update-gitignore');
      return Promise.resolve();
    });

    if(mockInitDirs) {
      td.replace(createTask, 'initDirs', function() {
        tasks.push('create-dirs');
        return Promise.resolve();
      });
    }
  };

  afterEach(function() {
    td.reset();
  });

  it('runs tasks in the correct order', function() {
    initTask();

    return createTask.run().then(function() {
      expect(tasks).to.deep.equal([
        'create-dirs',
        'create-cordova-project',
        'update-gitignore',
        'framework-after-install'
      ]);
    });
  });

  it('inits CreateCordova with id, name & templatePath', function() {
    CreateCordova = td.replace('../../../lib/targets/cordova/tasks/create-project')
    let createCdvMock = td.constructor(CreateCordova);
    initTask();
    createTask.templatePath = 'passedTemplatePath';

    return createTask.run().then(function() {
      td.verify(new CreateCordova({
        id: 'com.embercordova.emberCordovaMock',
        name: 'com.emberCordova.app',
        templatePath: 'passedTemplatePath',
        project: isAnything(),
        ui: isAnything()
      }));
    });

  });

  context('initDirs', function() {
    let emberCdvPath = path.resolve(
      __dirname, '..', '..',
      'fixtures',
      'ember-cordova-mock',
      'ember-cordova'
    );

    beforeEach(function() {
      td.replace(frameworkType, 'get', function() {
        return 'ember';
      });
    });

    afterEach(function() {
      td.reset();
    });

    it('inits ember-cordova && config directories', function() {
      let mkDouble = td.replace(fsUtils, 'mkdir');
      td.replace(fsUtils, 'copy');

      initTask(false);
      createTask.run();
      td.verify(mkDouble(emberCdvPath));
    });

    it('attempts to copy the frameworks config', function() {
      let copyDouble = td.replace(fsUtils, 'copy');
      initTask(false);

      createTask.run();

      td.verify(copyDouble(
        contains('lib/templates/framework-config/ember.js'),
        emberCdvPath + '/config/config.js'
      ));
    });
  });
});
