const cordovaPath     = require('../../../../../lib/targets/cordova/utils/get-path');
const expect          = require('../../../../helpers/expect');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const path            = require('path');
const lodash          = require('lodash');
const td              = require('testdouble');
const xml2js          = require('xml2js');

const parseHelper = (xml) => {
  return new Promise(function(resolve, reject) {
    let parser = new xml2js.Parser();

    parser.parseString(xml, function(err, result) {
      if (err) {
        return reject(err);
      }

      if (result) {
        resolve(result);
      }
    });
  });
};

describe('Edit XML Util', function() {
  let editXml;
  let parseXml;
  let fs;

  let cdvPath;
  let configPath;
  let project;

  beforeEach(function() {
    fs = td.replace('fs');
    parseXml = td.replace('../../../../../lib/utils/parse-xml');

    editXml = require('../../../../../lib/targets/cordova/utils/edit-xml');

    project = mockProject.project;
    cdvPath = cordovaPath(mockProject.project);
    configPath = path.join(cdvPath, 'config.xml');
  });

  describe('addNavigation function', function() {
    it('adds allow-navigation node to the xml file', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: { '$': {} }
      });

      return editXml.addNavigation(project, 'host').then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        const node = lodash.find(json.widget['allow-navigation'], {
          '$': { name: 'ec-nav' }
        });

        expect(node).to.not.be.undefined;
        expect(node.$.href).to.equal('host');
      });
    });

    it('leaves existing allow-navigation nodes in place', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          'allow-navigation': [
            { '$': { href: 'foo', name: 'bar' } }
          ]
        }
      });

      return editXml.addNavigation(project, 'host').then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        const node = lodash.find(json.widget['allow-navigation'], {
          '$': { name: 'bar' }
        });

        expect(node).to.not.be.undefined;
        expect(node.$.href).to.equal('foo');
      });
    });
  });

  describe('removeNavigation function', function() {
    it('removes ec-nav allow-navigation node from the xml file', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          'allow-navigation': [
            { '$': { href: 'host', name: 'ec-nav' } }
          ],
        }
      });

      return editXml.removeNavigation(project).then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        const node = lodash.find(json.widget['allow-navigation'], {
          '$': { name: 'ec-nav' }
        });

        expect(node).to.be.undefined;
      });
    });

    it('does not remove other allow-navigation nodes', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          'allow-navigation': [
            { '$': { href: 'host', name: 'ec-nav' } },
            { '$': { href: 'foo', name: 'bar' } }
          ]
        }
      });

      return editXml.removeNavigation(project).then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        const node = lodash.find(json.widget['allow-navigation'], {
          '$': { name: 'bar' }
        });

        expect(node).to.not.be.undefined;
        expect(node.$.href).to.equal('foo');
      });
    });
  });

  describe('addAndroidCleartext function', function() {
    it('adds xmlns:android if missing', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          $: {},
          platform: [
            { '$': { name: 'android'} }
          ]
        },
      });

      return editXml.addAndroidCleartext(project).then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        expect(json.widget.$['xmlns:android']).to.equal('http://schemas.android.com/apk/res/android');
      });
    });

    it('leave xmlns:android in place if present', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          $: {
            'xmlns:android': 'foo'
          },
          platform: [
            { '$': { name: 'android' } }
          ]
        },
      });

      return editXml.addAndroidCleartext(project).then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        expect(json.widget.$['xmlns:android']).to.equal('foo');
      });
    });

    it('adds clearText application tag if missing', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          $: {},
          platform: [
            { '$': { name: 'android' } }
          ]
        },
      });

      return editXml.addAndroidCleartext(project).then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        let androidPlatform = lodash.find(json.widget.platform, {
          '$': { name: 'android' }
        });

        expect(androidPlatform).to.not.be.undefined;

        let editConfig = lodash.find(androidPlatform['edit-config'], {
          '$': { file: 'app/src/main/AndroidManifest.xml' }
        });

        expect(editConfig).to.not.be.undefined;
        expect(editConfig.application).to.not.be.undefined;

        let application = lodash.find(editConfig.application, (app) => {
          return app['$'].hasOwnProperty('android:usesCleartextTraffic');
        });

        expect(application).to.not.be.undefined;
        expect(application['$']['android:usesCleartextTraffic']).to.not.be.undefined;
      });
    });

    it('overwrites existing cleartext application tag if present', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          $: {},
          platform: [
            {
              '$': { name: 'android' },
              'edit-config': [
                {
                  '$': { file: 'app/src/main/AndroidManifest.xml' },
                  application: [
                    { $: { 'android:usesCleartextTraffic': 'foo' } }
                  ]
                }
              ]
            }
          ]
        },
      });

      return editXml.addAndroidCleartext(project).then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        let androidPlatform = lodash.find(json.widget.platform, {
          '$': { name: 'android' }
        });

        expect(androidPlatform).to.not.be.undefined;

        let editConfig = lodash.find(androidPlatform['edit-config'], {
          '$': { file: 'app/src/main/AndroidManifest.xml' }
        });

        expect(editConfig).to.not.be.undefined;
        expect(editConfig.application).to.not.be.undefined;

        let application = lodash.find(editConfig.application, (app) => {
          return app['$'].hasOwnProperty('android:usesCleartextTraffic');
        });

        expect(application).to.not.be.undefined;
        expect(application['$']['android:usesCleartextTraffic']).to.equal('true');
      });
    });
  });

  describe('removeAndroidCleartext function', function() {
    it('removes edit-config when no other application tags', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          $: {},
          platform: [
            {
              '$': { name: 'android' },
              'edit-config': [
                {
                  '$': { file: 'app/src/main/AndroidManifest.xml' },
                  application: [
                    { $: { 'android:usesCleartextTraffic': 'true' } }
                  ]
                }
              ]
            }
          ]
        },
      });

      return editXml.removeAndroidCleartext(project).then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        let androidPlatform = lodash.find(json.widget.platform, {
          '$': { name: 'android' }
        });

        expect(androidPlatform).to.not.be.undefined;

        let editConfig = lodash.find(androidPlatform['edit-config'], {
          '$': { file: 'app/src/main/AndroidManifest.xml' }
        });

        expect(editConfig).to.be.undefined;
      });
    });

    it('does not remove other application tags', function() {
      td.when(parseXml(configPath)).thenResolve({
        widget: {
          $: {},
          platform: [
            {
              '$': { name: 'android' },
              'edit-config': [
                {
                  '$': { file: 'app/src/main/AndroidManifest.xml' },
                  application: [
                    { $: { 'android:usesCleartextTraffic': 'true' } },
                    { $: { 'foo': 'bar' } }
                  ]
                }
              ]
            }
          ]
        },
      });

      return editXml.removeAndroidCleartext(project).then(() => {
        let captor = td.matchers.captor();
        td.verify(fs.writeFileSync(configPath, captor.capture()));

        return parseHelper(captor.values[0]);
      }).then((json) => {
        let androidPlatform = lodash.find(json.widget.platform, {
          '$': { name: 'android' }
        });

        expect(androidPlatform).to.not.be.undefined;

        let editConfig = lodash.find(androidPlatform['edit-config'], {
          '$': { file: 'app/src/main/AndroidManifest.xml' }
        });

        expect(editConfig).to.not.be.undefined;
        expect(editConfig.application).to.not.be.undefined;

        let application = lodash.find(editConfig.application, (app) => {
          return app['$'].hasOwnProperty('android:usesCleartextTraffic');
        });

        expect(application).to.be.undefined;

        application = lodash.find(editConfig.application, (app) => {
          return app.$.hasOwnProperty('foo');
        });

        expect(application.$.foo).to.equal('bar');
      });
    });
  });
});
