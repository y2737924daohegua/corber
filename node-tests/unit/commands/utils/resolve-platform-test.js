const td       = require('testdouble');
const expect   = require('../../../helpers/expect');
const Promise  = require('rsvp').Promise;

const project  = { root: 'root' };

describe('resolvePlatform Command Util', () => {
  let getPlatforms;
  let resolvePlatform;

  beforeEach(() => {
    getPlatforms = td.replace('../../../../lib/targets/cordova/utils/get-platforms');

    td.when(getPlatforms(project))
      .thenReturn(Promise.resolve(['ios', 'android']));

    resolvePlatform = require('../../../../lib/commands/utils/resolve-platform');
  });

  afterEach(() => {
    td.reset();
  });

  it('defaults to iOS', () => {
    return expect(resolvePlatform(project)).to.eventually.equal('ios');
  });

  it('returns iOS if specified', () => {
    return expect(resolvePlatform(project, 'ios')).to.eventually.equal('ios');
  });

  it('returns android if specified', () => {
    return expect(resolvePlatform(project, 'android')).to.eventually.equal('android');
  });

  it('rejects if specified platform is invalid', () => {
    return expect(resolvePlatform(project, 'invalid-platform'))
      .to.eventually.be.rejectedWith(/'invalid-platform' is not a valid platform/);
  });

  context('when iOS platform is not installed', () => {
    beforeEach(() => {
      td.when(getPlatforms(project))
        .thenReturn(Promise.resolve(['android']));
    });

    it('defaults to android', () => {
      return expect(resolvePlatform(project)).to.eventually.equal('android');
    });

    it('rejects if iOS is specified', () => {
      return expect(resolvePlatform(project, 'ios'))
        .to.eventually.be.rejectedWith(/'ios' is not an installed platform/);
    });
  });

  context('when android platform is not installed', () => {
    beforeEach(() => {
      td.when(getPlatforms(project)).thenReturn(Promise.resolve(['ios']));
    });

    it('rejects if android is specified', () => {
      return expect(resolvePlatform(project, 'android'))
        .to.eventually.be.rejectedWith(/'android' is not an installed platform/);
    });
  });

  context('when no platforms are installed', () => {
    beforeEach(() => {
      td.when(getPlatforms(project)).thenReturn(Promise.resolve([]));
    });

    it('rejects with \'no platforms installed\'', () => {
      return expect(resolvePlatform(project))
        .to.eventually.be.rejectedWith(/no platforms installed/);
    })
  });
});
