const td                = require('testdouble');
const expect            = require('../../../../helpers/expect');
const path              = require('path');

const root              = 'root';
const basePath          = path.join(root, 'platforms', 'android');
const gradleDebugPath   = path.join(basePath, 'build', 'outputs', 'apk', 'debug');
const gradleReleasePath = path.join(basePath, 'build', 'outputs', 'apk', 'release');
const studioDebugPath   = path.join(basePath, 'app', 'build', 'outputs', 'apk', 'debug');
const studioReleasePath = path.join(basePath, 'app', 'build', 'outputs', 'apk', 'release');

describe('Android apk paths util', function() {
  let fs;
  let logger;
  let getApkPath;

  beforeEach(() => {
    fs = td.replace('fs');
    logger = td.replace('../../../../../lib/utils/logger');

    td.when(fs.existsSync(gradleReleasePath)).thenReturn(true);
    td.when(fs.existsSync(gradleDebugPath)).thenReturn(true);
    td.when(fs.existsSync(studioReleasePath)).thenReturn(true);
    td.when(fs.existsSync(studioDebugPath)).thenReturn(true);

    getApkPath = require('../../../../../lib/targets/android/utils/apk-path');
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves to gradle release path if available', () => {
    td.when(fs.readdirSync(gradleReleasePath)).thenReturn(['app.apk']);
    td.when(fs.readdirSync(studioReleasePath)).thenReturn([]);

    let apkPath = path.join(gradleReleasePath, 'app.apk');
    return expect(getApkPath(root)).to.eventually.equal(apkPath);
  });

  it('resolves to studio release path when gradle not available', () => {
    td.when(fs.readdirSync(gradleReleasePath)).thenReturn([]);
    td.when(fs.readdirSync(studioReleasePath)).thenReturn(['app.apk']);

    let apkPath = path.join(studioReleasePath, 'app.apk');
    return expect(getApkPath(root)).to.eventually.equal(apkPath);
  });

  it('prefers gradle release path over studio', () => {
    td.when(fs.readdirSync(gradleReleasePath)).thenReturn(['app.apk']);
    td.when(fs.readdirSync(studioReleasePath)).thenReturn(['app.apk']);

    let apkPath = path.join(gradleReleasePath, 'app.apk');
    return expect(getApkPath(root)).to.eventually.equal(apkPath);
  });

  it('does not reject if gradle dir does not exist', () => {
    td.when(fs.existsSync(gradleReleasePath)).thenReturn(false);
    td.when(fs.readdirSync(studioReleasePath)).thenReturn(['app.apk']);

    return expect(getApkPath(root)).to.eventually.be.fulfilled;
  });

  it('does not reject if studio dir does not exist', () => {
    td.when(fs.readdirSync(gradleReleasePath)).thenReturn(['app.apk']);
    td.when(fs.existsSync(studioReleasePath)).thenReturn(false);

    return expect(getApkPath(root)).to.eventually.be.fulfilled;
  });

  it('issues a warning if more than one apk found', () => {
    td.when(fs.readdirSync(gradleReleasePath)).thenReturn(['app.apk']);
    td.when(fs.readdirSync(studioReleasePath)).thenReturn(['app.apk']);

    return getApkPath(root).then(() => {
      td.verify(logger.warn(td.matchers.contains('More than one apk found')));
    });
  });

  it('rejects if no apk found', () => {
    td.when(fs.readdirSync(gradleReleasePath)).thenReturn([]);
    td.when(fs.readdirSync(studioReleasePath)).thenReturn([]);

    return expect(getApkPath(root)).to.eventually.be.rejected;
  });

  it('does not match files without .apk extension', () => {
    td.when(fs.readdirSync(gradleReleasePath)).thenReturn(['app.txt']);
    td.when(fs.readdirSync(studioReleasePath)).thenReturn(['app.zip']);

    return expect(getApkPath(root)).to.eventually.be.rejected;
  });

  context('when debug specified', () => {
    it('resolves to gradle debug path if avaible', () => {
      td.when(fs.readdirSync(gradleDebugPath)).thenReturn(['app.apk']);
      td.when(fs.readdirSync(studioDebugPath)).thenReturn([]);

      let apkPath = path.join(gradleDebugPath, 'app.apk');
      return expect(getApkPath(root, { debug: true })).to.eventually.equal(apkPath);
    });

    it('resolves to studio debug path when gradle not available', () => {
      td.when(fs.readdirSync(gradleDebugPath)).thenReturn([]);
      td.when(fs.readdirSync(studioDebugPath)).thenReturn(['app.apk']);

      let apkPath = path.join(studioDebugPath, 'app.apk');
      return expect(getApkPath(root, { debug: true })).to.eventually.equal(apkPath);
    });

    it('prefers gradle debug path over studio', () => {
      td.when(fs.readdirSync(gradleDebugPath)).thenReturn(['app.apk']);
      td.when(fs.readdirSync(studioDebugPath)).thenReturn(['app.apk']);

      let apkPath = path.join(gradleDebugPath, 'app.apk');
      return expect(getApkPath(root, { debug: true })).to.eventually.equal(apkPath);
    });
  });
});
