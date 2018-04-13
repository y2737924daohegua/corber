const td          = require('testdouble');
const mockProject = require('../../fixtures/corber-mock/project');

const logger      = require('../../../lib/utils/logger');
const contains    = td.matchers.contains;

let versions, infoDouble, versionCmd;

describe('Version Command', () => {
  beforeEach(() => {
    versions = {
      corber: {
        global: '1.0.0',
        project: '2.0.0'
      },
      node: '8.9.4'
    };

    td.replace('../../../lib/utils/get-versions', (root) => {
      return versions;
    });

    infoDouble = td.replace(logger, 'info');

    let VersionCmd = require('../../../lib/commands/version');

    versionCmd = new VersionCmd({
      project: mockProject.project
    });
  });

  afterEach(() => {
    td.reset();
  });

  describe('run', () => {
    it('shows corber and node versions', () => {
      return versionCmd.run().then(() => {
        td.verify(infoDouble('corber (global): 1.0.0'));
        td.verify(infoDouble('corber (project): 2.0.0'));
        td.verify(infoDouble('node: 8.9.4'));
      })
    });

    context('when project version unavailable', () => {
      beforeEach(() => {
        delete versions.corber.project;
      });

      it('does not show project version', () => {
        return versionCmd.run().then(() => {
          td.verify(infoDouble(contains('corber (project)')), { times: 0 });
        })
      });
    })
  });
});
