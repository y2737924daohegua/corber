const td          = require('testdouble');
const mockProject = require('../../fixtures/corber-mock/project');
const contains    = td.matchers.contains;
const root        = mockProject.project.root;

describe('Version Command', () => {
  let logger, getVersions;
  let versionCmd;

  beforeEach(() => {
    logger = td.replace('../../../lib/utils/logger');
    getVersions = td.replace('../../../lib/utils/get-versions');

    td.when(getVersions(root)).thenReturn({
      corber: {
        global: '1.0.0',
        project: {
          required: '>2.0.0',
          installed: '2.0.1'
        }
      },
      node: '8.9.4'
    });

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
        td.verify(logger.info('corber (global): 1.0.0'));
        td.verify(logger.info('corber (package.json): >2.0.0'));
        td.verify(logger.info('corber (node_modules): 2.0.1'));
        td.verify(logger.info('node: 8.9.4'));
      })
    });

    context('when global version unavailable', () => {
      beforeEach(() => {
        td.when(getVersions(root)).thenReturn({
          corber: {
            project: {
              required: '>2.0.0',
              installed: '2.0.1'
            }
          },
          node: '8.9.4'
        });
      });

      it('does not show global version', () => {
        return versionCmd.run().then(() => {
          td.verify(logger.info(contains('corber (global)')), { times: 0 });
        })
      });
    });

    context('when required version unavailable', () => {
      beforeEach(() => {
        td.when(getVersions(root)).thenReturn({
          corber: {
            global: '1.0.0',
            project: {
              installed: '2.0.1'
            }
          },
          node: '8.9.4'
        });
      });

      it('does not show required version', () => {
        return versionCmd.run().then(() => {
          td.verify(logger.info(contains('corber (package.json)')), {
            times: 0
          });
        })
      });
    });

    context('when installed version unavailable', () => {
      beforeEach(() => {
        td.when(getVersions(root)).thenReturn({
          corber: {
            global: '1.0.0',
            project: {
              required: '>2.0.0'
            }
          },
          node: '8.9.4'
        });
      });

      it('does not show installed version', () => {
        return versionCmd.run().then(() => {
          td.verify(logger.info(contains('corber (node_modules)')), {
            times: 0
          });
        })
      });
    });
  });
});
