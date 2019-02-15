const td          = require('testdouble');
const expect      = require('../../../helpers/expect');
const Promise     = require('rsvp').Promise;
const CorberError = require('../../../../lib/utils/corber-error');

const project     = { root: 'root' };

describe('expandPlatforms Command Util', () => {
  let getPlatforms;
  let expandPlatforms;

  beforeEach(() => {
    getPlatforms = td.replace('../../../../lib/targets/cordova/utils/get-platforms');

    td.when(getPlatforms(project))
      .thenReturn(Promise.resolve(['added-platform']));

    expandPlatforms = require('../../../../lib/commands/utils/expand-platforms');
  });

  context('when \'added\' is a specified platform', () => {
    it('appends added platforms', () => {
      return expect(expandPlatforms(project, ['added']))
        .to.eventually.include('added-platform');
    });

    it('removes \'added\' from list', () => {
      return expect(expandPlatforms(project, ['added']))
        .to.eventually.not.include('added');
    });

    it('does not remove another specified platform', () => {
      return expect(expandPlatforms(project, ['specified-platform', 'added']))
        .to.eventually.include('specified-platform');
    });

    it('does not introduce a duplicate platform', () => {
      return expect(expandPlatforms(project, ['added-platform', 'added']))
        .to.eventually.deep.equal(['added-platform'])
    });

    it('rejects with CorberError if no added platforms', () => {
      td.when(getPlatforms(project)).thenReturn(Promise.resolve([]));

      return expect(expandPlatforms(project, ['added']))
        .to.eventually.be.rejectedWith(CorberError);
    });
  });

  context('when \'added\' is not a specified platform', () => {
    it('does not remove a specified platform', () => {
      return expect(expandPlatforms(project, ['specified-platform']))
        .to.eventually.include('specified-platform');
    });

    it('does not append any unspecified added platforms', () => {
      return expect(expandPlatforms(project), ['specified-platform'])
        .to.eventually.not.include('added-platform');
    });
  });
});
