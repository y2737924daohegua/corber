const expect          = require('../../helpers/expect');
const td              = require('testdouble');

const root            = 'root';

describe('Command', () => {
  let Leek;
  let configStore;
  let logger;
  let getVersions;

  let Command;
  let options;

  beforeEach(() => {
    Leek = td.replace('leek');

    configStore = td.replace('configstore');
    td.when(configStore.prototype.get('uuid')).thenReturn('uuid');

    let uuid = td.replace('uuid');
    td.when(uuid.v4()).thenReturn({
      toString: () => 'new-uuid'
    });

    logger = td.replace('../../../lib/utils/logger');
    getVersions = td.replace('../../../lib/utils/get-versions');

    Command = require('../../../lib/commands/-command');

    options = {
      name: 'abstract-command',
      ui: td.object(['setWriteLevel']),
      settings: {},
      project: {
        root,
        isEmberCLIProject: () => true
      }
    };
  });

  afterEach(() => {
    td.reset();
  });

  describe('init()', () => {
    it('sets uuid if none exists', () => {
      td.when(configStore.prototype.get('uuid')).thenReturn(undefined);
      new Command(options);
      td.verify(configStore.prototype.set('uuid', 'new-uuid'));
    });

    it('creates an analytics object', () => {
      let cmd = new Command(options);

      let optsMatcher = td.matchers.contains({
        name: 'uuid',
        globalName: 'ember-cordova',
        silent: false,
        trackingCode: 'UA-50368464-2',
        version: 'unknown'
      });

      td.verify(new Leek(optsMatcher));
      expect(cmd.analytics).to.be;
    });

    it('disables analytics if `disableEcAnalytics: true`', () => {
      options.settings.disableEcAnalytics = true;
      new Command(options);
      td.verify(new Leek(td.matchers.contains({ silent: true })))
    });

    it('passes version to analytics', () => {
      td.when(getVersions(root)).thenReturn({
        corber: {
          project: {
            required: '1.0'
          }
        }
      });

      new Command(options);
      td.verify(new Leek(td.matchers.contains({ version: '1.0' })))
    });

    it('sets `isWithinProject: false` outside of a corber project', () => {
      let cmd = new Command(options);
      expect(cmd.isWithinProject).to.be.false;
    });

    it('sets `isWithinProject: true` inside a corber project', () => {
      td.when(getVersions(root)).thenReturn({
        corber: {
          project: {
            required: '1.0'
          }
        }
      });

      let cmd = new Command(options);
      expect(cmd.isWithinProject).to.be.true;
    });
  });

  describe('run()', () => {
    it('returns a resolved promise', () => {
      let cmd = new Command(options);
      expect(cmd.run()).to.eventually.be.fulfilled;
    });

    it('sets log level with `options.quiet`', () => {
      let cmd = new Command(options);
      cmd.run({ quiet: true });

      td.verify(logger.setLogLevel('error'));
    });

    it('sets log level with `options.verbose`', () => {
      let cmd = new Command(options);
      cmd.run({ verbose: true });

      td.verify(logger.setLogLevel('verbose'));
    });

    it('prioritizes `options.verbose` over `options.quiet`', () => {
      let cmd = new Command(options);
      cmd.run({ quiet: true, verbose: true });

      td.verify(logger.setLogLevel('verbose'));
    });

    it('tracks command name through analytics', () => {
      let cmd = new Command(options);
      cmd.run();
      td.verify(Leek.prototype.track({ message: 'abstract-command' }));
    });
  });

  describe('validateAndRun()', () => {
    it('exits if `scope: insideProject`, `isWithinProject: true`', () => {
      let cmd = new Command(options);

      cmd.scope = 'insideProject';
      cmd.isWithinProject = true

      return expect(() => cmd.validateAndRun()).to.not.throw;
    });

    it('exits if `scope: outsideProject`, `isWithinProject: false`', () => {
      let cmd = new Command(options);

      cmd.scope = 'outsideProject';
      cmd.isWithinProject = false;

      return expect(() => cmd.validateAndRun()).to.not.throw;
    });

    it('throws if `scope: insideProject`, `isWithinProject: false`', () => {
      let cmd = new Command(options);

      cmd.scope = 'insideProject';
      cmd.isWithinProject = false;

      return expect(() => cmd.validateAndRun()).to.throw;
    });

    it('throws if `scope: \'outsideProject\', `isWithinProject: true`', () => {
      let cmd = new Command(options);

      cmd.scope = 'outsideProject';
      cmd.isWithinProject = true;

      return expect(() => cmd.validateAndRun()).to.throw;
    });
  });
});
