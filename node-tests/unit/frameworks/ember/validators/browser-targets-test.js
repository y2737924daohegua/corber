const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const path            = require('path');
const contains        = td.matchers.contains;
const anything        = td.matchers.anything;
const root            = mockProject.project.root;

let targetsPath       = path.join(root, 'config', 'targets.js');

describe('Validate Browser Targets', () => {
  let fsUtils, logger, getCLIVersion;
  let validation;

  beforeEach(() => {
    getCLIVersion = td.replace('../../../../../lib/frameworks/ember/utils/get-cli-version');
    fsUtils = td.replace('../../../../../lib/utils/fs-utils');
    logger = td.replace('../../../../../lib/utils/logger');

    let BrowserTargetsValidation = require('../../../../../lib/frameworks/ember/validators/browser-targets');
    validation = new BrowserTargetsValidation({ root });

    td.when(getCLIVersion(root)).thenReturn('2.13.0');
    td.when(fsUtils.existsSync(targetsPath)).thenReturn(true);
    td.when(fsUtils.read(targetsPath), { ignoreExtraArgs: true })
      .thenResolve('if (process.env.CORBER_PLATFORM) { /* optimize */ }');
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves', () => {
    return expect(validation.run()).to.eventually.be.fulfilled;
  });

  it('does not log a warning', () => {
    return validation.run().then(() => {
      td.verify(logger.warn(anything()), { times: 0 });
    });
  });

  context('when targets.js does not exist', () => {
    beforeEach(() => {
      td.when(fsUtils.existsSync(targetsPath)).thenReturn(false);
    });

    it('resolves', () => {
      return expect(validation.run()).to.eventually.be.fulfilled;
    });

    it('warns that targets.js was not found', () => {
      return validation.run().then(() => {
        td.verify(logger.warn(contains('targets.js was not found')));
      });
    });

    context('when ember-cli is < 2.13', () => {
      beforeEach(() => {
        td.when(getCLIVersion(root)).thenReturn('2.12.0');
      });

      it('resolves', () => {
        return expect(validation.run()).to.eventually.be.fulfilled;
      });

      it('does not log a warning', () => {
        return validation.run().then(() => {
          td.verify(logger.warn(anything()), { times: 0 });
        });
      });
    });
  });

  context('when targets.js does not reference env variable', () => {
    beforeEach(() => {
      td.when(fsUtils.read(targetsPath), { ignoreExtraArgs: true })
        .thenResolve('/* not optimized */');
    });

    it('resolves', () => {
      return expect(validation.run()).to.eventually.be.fulfilled;
    });

    it('warns that targets.js has not been configured', () => {
      return validation.run().then(() => {
        td.verify(logger.warn(contains('targets.js has not been configured')));
      });
    });

    context('when ember-cli is < 2.13', () => {
      beforeEach(() => {
        td.when(getCLIVersion(root)).thenReturn('2.12.0');
      });

      it('resolves', () => {
        return expect(validation.run()).to.eventually.be.fulfilled;
      });

      it('does not log a warning', () => {
        return validation.run().then(() => {
          td.verify(logger.warn(anything()), { times: 0 });
        });
      });
    });
  });
});
