const td            = require('testdouble');
const Promise       = require('rsvp').Promise;
const mockProject   = require('../../fixtures/corber-mock/project');
const mockAnalytics = require('../../fixtures/corber-mock/analytics');
const cloneDeep     = require('lodash').cloneDeep;
const path          = require('path');

describe('Lint Index Command', () => {
  let lintTask;

  let project;
  let lint;
  let opts;

  beforeEach(() => {
    let getCordovaPath = td.replace('../../../lib/targets/cordova/utils/get-path');
    lintTask = td.replace('../../../lib/tasks/lint-index');

    project = cloneDeep(mockProject.project);

    td.when(getCordovaPath(project)).thenReturn('cordova');
    td.when(lintTask(), { ignoreExtraArgs: true }).thenReturn(Promise.resolve());

    let LintCommand = require('../../../lib/commands/lint-index');

    lint = new LintCommand({
      project
    });

    lint.analytics = mockAnalytics;

    opts = {};
  });

  afterEach(() => {
    td.reset();
  });

  context('when options contains source', () => {
    it('calls Lint Index Task', () => {
      opts.source = 'www/index.html';

      return lint.run(opts).then(() => {
        td.config({ ignoreWarnings: true });
        td.verify(lintTask(path.join('cordova', opts.source)));
        td.config({ ignoreWarnings: false });
      });
    });
  });
});
