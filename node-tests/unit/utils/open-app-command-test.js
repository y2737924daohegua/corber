const expect = require('../../helpers/expect');
const openAppCommand = require('../../../lib/utils/open-app-command');

describe('openAppCommand util', () => {
  context('platform is darwin', () => {
    beforeEach(() => {
      Object.defineProperty(process, 'platform', {
        value: 'darwin'
      });
    });

    it('returns a valid open command', () => {
      let command = openAppCommand('my app');
      expect(command).to.equal('open "my app"');
    });

    it('allows a custom opener', () => {
      let command = openAppCommand('my app', 'my opener');
      expect(command).to.equal('open -a "my opener" "my app"');
    });
  });

  context('platform is win32', () => {
    beforeEach(() => {
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      });
    });

    it('returns a valid open command', () => {
      let command = openAppCommand('my app');
      expect(command).to.equal('start "my app"');
    });

    it('allows a custom opener', () => {
      let command = openAppCommand('my app', 'my opener');
      expect(command).to.equal('start "" "my opener" "my app"');
    });
  });

  context('platform is something weird', () => {
    beforeEach(() => {
      Object.defineProperty(process, 'platform', {
        value: 'mysteryOS'
      });
    });
    it('returns an open command using xdg-open', () => {
      let command = openAppCommand('my app');
      expect(command).to.equal('xdg-open "my app"');
    });
  });
});

