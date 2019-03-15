const td          = require('testdouble');
const expect      = require('../../helpers/expect');
const mockProject = require('../../fixtures/corber-mock/project');
const path        = require('path');

const anything    = td.matchers.anything;
const contains    = td.matchers.contains;
const root        = mockProject.project.root;
const packagePath = path.join(root, 'package.json');

describe('Validate corber-ember-livereload', function() {
  let validateCorberEmber;
  let getPackage, logger;

  beforeEach(() => {
    getPackage = td.replace('../../../lib/utils/get-package');
    logger = td.replace('../../../lib/utils/logger');

    const ValidateCorberEmber = require('../../../lib/validators/livereload-package');
    validateCorberEmber = new ValidateCorberEmber({ root });
  });

  afterEach(() => {
    td.reset();
  });


  context('when packageName is listed in package.json devDependencies', () => {
    beforeEach(() => {
      validateCorberEmber.packageName = 'corber-ember-livereload';

      td.when(getPackage(packagePath)).thenReturn({
        devDependencies: {
          'corber-ember-livereload': 1.0
        },
        dependencies: {}
      });
    });

    it('resolves', () => {
      return expect(validateCorberEmber.run()).to.be.fulfilled;
    });

    it('does not log a warning', () => {
      return validateCorberEmber.run().then(() => {
        td.verify(logger.warn(anything()), { times: 0 });
      });
    });
  });

  context('when packageName is listed in package.json dependencies', () => {
    beforeEach(() => {
      validateCorberEmber.packageName = 'corber-ember-livereload';

      td.when(getPackage(packagePath)).thenReturn({
        dependencies: {
          'corber-ember-livereload': 1.0
        },
        devDependencies: {}
      });
    });

    it('resolves', () => {
      return expect(validateCorberEmber.run()).to.be.fulfilled;
    });

    it('does not log a warning', () => {
      return validateCorberEmber.run().then(() => {
        td.verify(logger.warn(anything()), { times: 0 });
      });
    });
  });

  context('when packageName is missing from package.json', () => {
    beforeEach(() => {
      validateCorberEmber.packageName = 'corber-ember-livereload';

      td.when(getPackage(packagePath)).thenReturn({
        dependencies: {},
        devDependencies: {}
      });
    });

    it('resolves', () => {
      return expect(validateCorberEmber.run()).to.be.fulfilled;
    });

    it('logs a warning', () => {
      return validateCorberEmber.run().then(() => {
        td.verify(logger.warn(contains('Could not find corber-ember-livereload')));
      });
    });
  });

  context('when package.json cannot be read', () => {
    beforeEach(() => {
      validateCorberEmber.packageName = 'corber-ember-livereload';

      td.when(getPackage(packagePath)).thenReturn(null);
    });

    it('rejects', () => {
      return expect(validateCorberEmber.run()).to.be.rejected;
    });

    it('passes an error', () => {
      return validateCorberEmber.run().catch((err) => {
        expect(err).to.contain('could not read package.json');
      });
    });
  });

  context('when packageName is not set', () => {
    it('rejects', () => {
      return expect(validateCorberEmber.run()).to.be.rejected;
    });

    it('passes an error', () => {
      return validateCorberEmber.run().catch((err) => {
        expect(err).to.contain('no package name provided');
      });
    });
  });
});
