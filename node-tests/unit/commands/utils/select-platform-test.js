const td       = require('testdouble');
const expect   = require('../../../helpers/expect');
const Promise  = require('rsvp').Promise;
const contains = td.matchers.contains;

const root     = 'root';

describe('selectPlatform', () => {
  let getPlatforms;
  let selectPlatform;

  beforeEach(() => {
    getPlatforms = td.replace('../../../../lib/targets/cordova/utils/get-platforms');

    td.when(getPlatforms(contains({ root })))
      .thenReturn(Promise.resolve(['ios', 'android']));

    selectPlatform = require('../../../../lib/commands/utils/select-platform');
  });

  afterEach(() => {
    td.reset();
  });

  it('defaults to iOS', () => {
    return expect(selectPlatform(root)).to.eventually.equal('ios');
  });

  it('returns iOS if specified', () => {
    return expect(selectPlatform(root, 'ios')).to.eventually.equal('ios');
  });

  it('returns android if specified', () => {
    return expect(selectPlatform(root, 'android')).to.eventually.equal('android');
  });

  it('rejects if specified platform is invalid', () => {
    return expect(selectPlatform(root, 'invalid-platform'))
      .to.eventually.be.rejectedWith(/'invalid-platform' is not a valid platform/);
  });

  context('when iOS platform is not installed', () => {
    beforeEach(() => {
      td.when(getPlatforms(contains({ root })))
        .thenReturn(Promise.resolve(['android']));
    });

    it('defaults to android', () => {
      return expect(selectPlatform(root)).to.eventually.equal('android');
    });

    it('rejects if iOS is specified', () => {
      return expect(selectPlatform(root, 'ios'))
        .to.eventually.be.rejectedWith(/'ios' is not an installed platform/);
    });
  });

  context('when android platform is not installed', () => {
    beforeEach(() => {
      td.when(getPlatforms(contains({ root })))
        .thenReturn(Promise.resolve(['ios']));
    });

    it('rejects if android is specified', () => {
      return expect(selectPlatform(root, 'android'))
        .to.eventually.be.rejectedWith(/'android' is not an installed platform/);
    });
  });

  context('when no platforms are installed', () => {
    beforeEach(() => {
      td.when(getPlatforms(contains({ root })))
        .thenReturn(Promise.resolve([]));
    });

    it('rejects with \'no platforms installed\'', () => {
      return expect(selectPlatform(root))
        .to.eventually.be.rejectedWith(/no platforms installed/);
    })
  });
});
