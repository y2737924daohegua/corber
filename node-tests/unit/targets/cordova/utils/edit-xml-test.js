const cordovaPath     = require('../../../../../lib/targets/cordova/utils/get-path');
const editXml         = require('../../../../../lib/targets/cordova/utils/edit-xml');
const expect          = require('../../../../helpers/expect');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const parseXml        = require('../../../../../lib/utils/parse-xml');
const path            = require('path');
const lodash          = require('lodash');

describe('Edit XML Util', function() {
  const host = 'http://localhost:8080';

  describe('addNavigation function', function() {
    it('add node to the xml file in addition to client nodes', function() {
      return editXml.addNavigation(mockProject.project, host).then(() => {
        let cdvPath = cordovaPath(mockProject.project);
        let configPath = path.join(cdvPath, 'config.xml');
        let xml = parseXml(configPath);
        let nodes = xml._result.widget['allow-navigation'].length;

        expect(nodes).to.equal(3);
      });
    });
  });

  describe('removeNavigation function', function() {
    beforeEach(function() {
      editXml.addNavigation(mockProject.project, host);
      editXml.removeNavigation(mockProject.project);
    });

    describe('if nodes placed by util exist', function() {
      it('removes util placed nodes and keep client nodes', function() {
        let cdvPath = cordovaPath(mockProject.project);
        let configPath = path.join(cdvPath, 'config.xml');
        let xml = parseXml(configPath);
        let nodes = xml._result.widget['allow-navigation'].length;

        expect(nodes).to.equal(2);
      });
    });
  });

  describe('addAndroidCleartext function', function() {
    it('adds and removes android cleartext/http bypass', function() {
      let cdvPath = cordovaPath(mockProject.project);
      let configPath = path.join(cdvPath, 'config.xml');

      return editXml.addAndroidCleartext(mockProject.project).then(() => {
        return parseXml(configPath).then((json) => {
          let platforms = json.widget.platform;
          let androidPlatform = lodash.find(platforms, { '$': { name: 'android' } });
          let xmlnsAndroid = json.widget['$']['xmlns:android'];

          expect(xmlnsAndroid).to.not.equal(undefined);
          expect(androidPlatform['edit-config']).to.not.equal(undefined);

          return editXml.removeAndroidCleartext(mockProject.project).then(() => {
            return parseXml(configPath).then((json) => {

              platforms = json.widget.platform;
              androidPlatform = lodash.find(platforms, { '$': { name: 'android' } })
              xmlnsAndroid = json.widget['$']['xmlns:android'];

              expect(xmlnsAndroid).to.equal(undefined);
              expect(androidPlatform['edit-config']).to.equal(undefined);
            });
          });
        });
      })
    });
  });
});
