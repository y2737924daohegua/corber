const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Promise         = require('rsvp').Promise;
const path            = require('path');

const cordovaPath     = 'cordova-path';
const packageJSONPath = path.join(cordovaPath, 'package.json');
const configXMLPath   = path.join(cordovaPath, 'config.xml');

describe('Get Platforms', () => {
  let getCordovaPath;
  let fsUtils;
  let getPackage;
  let parseXml;

  let getPlatforms;
  let project;

  beforeEach(() => {
    getCordovaPath = td.replace('../../../../../lib/targets/cordova/utils/get-path');
    fsUtils        = td.replace('../../../../../lib/utils/fs-utils');
    getPackage     = td.replace('../../../../../lib/utils/get-package');
    parseXml       = td.replace('../../../../../lib/utils/parse-xml');

    project = { root: 'root' };
    td.when(getCordovaPath(project)).thenReturn(cordovaPath);

    td.when(fsUtils.existsSync(packageJSONPath)).thenReturn(true);
    td.when(fsUtils.existsSync(configXMLPath)).thenReturn(true);

    td.when(getPackage(packageJSONPath)).thenReturn({
      cordova: {
        platforms: ['package-json-platform']
      }
    });

    td.when(parseXml(configXMLPath)).thenReturn(Promise.resolve({
      widget: {
        engine: [
          { $: { name: 'config-xml-platform' } }
        ]
      }
    }));

    getPlatforms = require('../../../../../lib/targets/cordova/utils/get-platforms');
  });

  afterEach(() => {
    td.reset();
  });

  it('throws if no argument passed', () => {
    return expect(() => getPlatforms()).to.throw;
  });

  it('throws if \'root\' property is missing from project hash', () => {
    delete project.root;
    return expect(() => getPlatforms(project)).to.throw;
  });

  it('returns platforms in cordova package.json', () => {
    return expect(getPlatforms(project))
      .to.eventually.deep.equal(['package-json-platform']);
  });

  it('returns platforms in config.xml if package.json is missing platforms key', () => {
    td.when(getPackage(packageJSONPath)).thenReturn({
      cordova: {}
    });

    return expect(getPlatforms(project))
      .to.eventually.deep.equal(['config-xml-platform']);
  });

  context('when package.json is missing', () => {
    beforeEach(() => {
      td.when(fsUtils.existsSync(packageJSONPath)).thenReturn(false);
    });

    it('returns platforms in config.xml', () => {
      return expect(getPlatforms(project))
        .to.eventually.deep.equal(['config-xml-platform']);
    });

    it('returns empty if config.xml is missing engine key', () => {
      td.when(parseXml(configXMLPath))
        .thenReturn(Promise.resolve({ widget: {} }));
      return expect(getPlatforms(project)).to.eventually.deep.equal([]);
    });

    it('returns empty if config.xml also missing', () => {
      td.when(fsUtils.existsSync(configXMLPath)).thenReturn(false);
      return expect(getPlatforms(project)).to.eventually.deep.equal([]);
    });
  });
});
