const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const RSVP            = require('rsvp');
const Promise         = RSVP.Promise;

const emulatorPath    = 'emulatorPath';
const emulatorName    = 'fake-emulator';
const emulator        = { name: emulatorName };
const spawnArgs       = [emulatorPath, ['-avd', emulatorName]];
const pollingInterval = 1;

describe('Android Boot Emulator', () => {
  let bootEmulator;
  let getEmulatorState;
  let deferred;
  let spawn;

  beforeEach(() => {
    let sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ emulator: emulatorPath });

    getEmulatorState = td.replace('../../../../../lib/targets/android/tasks/get-emulator-state');
    td.when(getEmulatorState()).thenReturn(Promise.resolve('1'));

    // simulate on-going process
    deferred = RSVP.defer();
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(deferred.promise);

    bootEmulator = require('../../../../../lib/targets/android/tasks/boot-emulator');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(deferred.promise);

    return bootEmulator(emulator, pollingInterval).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns emulator -avd and resolves when emulator changes state', () => {
    td.when(getEmulatorState()).thenReturn(Promise.resolve('0'));

    let promise = bootEmulator(emulator, pollingInterval);
    expect(promise).to.not.be.fulfilled;

    td.when(getEmulatorState()).thenReturn(Promise.resolve('1'));
    return expect(promise).to.eventually.be.fulfilled;
  });

  it('rejects when spawned emulator exits without rejecting', () => {
    td.when(getEmulatorState()).thenReturn(Promise.resolve('0'));

    // simulate early process exit
    deferred.resolve();

    return expect(bootEmulator(emulator, pollingInterval))
      .to.eventually.be.rejectedWith(/emulator failed to start/)
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(bootEmulator(emulator, pollingInterval))
      .to.eventually.be.rejectedWith('spawn error');
  });

  it('bubbles up error message when getEmulatorState rejects', () => {
    td.when(getEmulatorState())
      .thenReturn(Promise.reject('getEmulatorState error'));

    return expect(bootEmulator(emulator, pollingInterval))
      .to.eventually.be.rejectedWith('getEmulatorState error');
  });
});
