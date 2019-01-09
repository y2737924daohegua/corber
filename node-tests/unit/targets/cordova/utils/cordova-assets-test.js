const td              = require('testdouble');
const cordovaAssets   = require('../../../../../lib/targets/cordova/utils/cordova-assets');
const expect          = require('../../../../helpers/expect');
const fsUtils         = require('../../../../../lib/utils/fs-utils');
const logger          = require('../../../../../lib/utils/logger');
const path            = require('path');
const contains        = td.matchers.contains;

describe('Get Platform Assets Util', function() {
  afterEach(() => {
    td.reset();
  });

  describe('getPaths', function() {
    it('is valid for ios', function() {
      let assets = cordovaAssets.getPaths('ios', 'fakeProjectPath');
      let expectedPath = path.join('platforms', 'ios', 'www');
      expect(assets.assetsPath).to.equal(expectedPath);
    });

    it('pre cordova-android 7.0 is valid for android', function() {
      cordovaAssets._exists = () => { return true; }
      let assets = cordovaAssets.getPaths('android', 'fakeProjectPath');
      let expectedPath = path.join('platforms', 'android', 'assets', 'www');
      expect(assets.assetsPath).to.equal(expectedPath);
    });

    it('post cordova-android 7.0 is valid for android', function() {
      cordovaAssets._exists = () => { return false; }
      let assets = cordovaAssets.getPaths('android', 'fakeProjectPath');
      let expectedPath = path.join('platforms', 'android', 'platform_www');
      expect(assets.assetsPath).to.equal(expectedPath);
    });

    it('is valid for browser', function() {
      let assets = cordovaAssets.getPaths('browser', 'fakeProjectPath');
      let expectedPath = path.join('platforms', 'browser', 'www');
      expect(assets.assetsPath).to.equal(expectedPath);
    });

    it('adds cordova_plugins.js to files', function() {
      let assets = cordovaAssets.getPaths('ios', 'fakeProjectPath');
      expect(assets.files).to.deep.equal(
        ['cordova_plugins.js', 'cordova.js']
      );
    });
  });

  describe('validatePaths', function() {
    it('throws an error if assetsPath is undefined', function() {
      expect(function() {
        cordovaAssets.validatePaths();
      }).to.throw(
        'corber: Platform asset path undefined, cant build'
      );
    });

    it('throws an error if cordova.js does not exist', function() {
      td.replace(fsUtils, 'existsSync', function(path) {
        return path !== 'path/cordova.js'
      });

      let warnDouble = td.replace(logger, 'warn');
      cordovaAssets.validatePaths('fakeAssetPath', 'fakeProjectPath');

      td.verify(warnDouble(contains('Did not find')));
      td.verify(warnDouble(contains('cordova.js')));
    });

    it('throws an error if cordova_plugins.js does not exist', function() {
      td.replace(fsUtils, 'existsSync', function(path) {
        return path !== 'path/cordova_plugins.js'
      });

      let warnDouble = td.replace(logger, 'warn');
      cordovaAssets.validatePaths('fakeAssetPath', 'fakeProjectPath');

      td.verify(warnDouble(contains('Did not find')));
      td.verify(warnDouble(contains('cordova_plugins.js')));
    });
  });
});
