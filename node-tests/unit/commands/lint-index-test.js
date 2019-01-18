const td            = require('testdouble');
const Promise       = require('rsvp').Promise;
const mockProject   = require('../../fixtures/corber-mock/project');
const mockAnalytics = require('../../fixtures/corber-mock/analytics');

describe('Lint Index Command', () => {
  let LintTask;

  let lint;
  let opts;

  beforeEach(() => {
    LintTask = td.replace('../../../lib/tasks/lint-index');

    td.when(LintTask.prototype.run()).thenReturn(Promise.resolve());

    let LintCommand = require('../../../lib/commands/lint-index');

    lint = new LintCommand({
      project: mockProject.project
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
        td.verify(LintTask.prototype.run());
        td.config({ ignoreWarnings: false });
      });
    });
  });
});
