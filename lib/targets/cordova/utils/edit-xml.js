const cordovaPath      = require('./get-path');
const fs               = require('fs');
const parseXml         = require('../../../utils/parse-xml');
const path             = require('path');
const xml2js           = require('xml2js');
const lodash           = require('lodash');

const builder = new xml2js.Builder({
  renderOpts: {
    'pretty': true,
    'indent': '    ',
    'newline': '\n'
  }
});

module.exports = {
  addNavigation(project, host) {
    let cdvPath = cordovaPath(project);
    let configPath = path.join(cdvPath, 'config.xml');

    return parseXml(configPath).then(function(json) {
      let navOptions = { $: { href: host, name: 'ec-nav' }};

      if (!json.widget['allow-navigation']) {
        json.widget['allow-navigation'] = [];
      }

      json.widget['allow-navigation'].push(navOptions);

      let xml = builder.buildObject(json);

      fs.writeFileSync(configPath, xml);
    });
  },

  removeNavigation(project, host) {
    let cdvPath = cordovaPath(project);
    let configPath = path.join(cdvPath, 'config.xml');

    return parseXml(configPath).then(function(json) {
      lodash.remove(json.widget['allow-navigation'], {
        '$': { name: 'ec-nav' }
      });

      let xml = builder.buildObject(json);

      fs.writeFileSync(configPath, xml);
    });
  },

  addAndroidCleartext(project) {
    let cdvPath = cordovaPath(project);
    let configPath = path.join(cdvPath, 'config.xml');

    return parseXml(configPath).then(function(json) {
      if (json.widget['$']['xmlns:android'] === undefined) {

        json.widget['$']['xmlns:android'] = 'http://schemas.android.com/apk/res/android';
      }

      let platforms = json.widget.platform;
      let androidPlatform = lodash.find(platforms,
        { '$': { name: 'android' } }
      );

      if (androidPlatform['edit-config'] === undefined) {
        androidPlatform['edit-config'] = [];
      }

      let editConfig = lodash.find(androidPlatform['edit-config'], {
        '$': { file: 'app/src/main/AndroidManifest.xml' }
      });

      if (editConfig === undefined) {
        editConfig = {
          '$': {
            file: 'app/src/main/AndroidManifest.xml',
            mode: 'merge',
            target: '/manifest/application'
          }
        };

        androidPlatform['edit-config'].push(editConfig);
      }

      if (editConfig.application === undefined) {
        editConfig.application = [];
      }

      let application = lodash.find(editConfig.application, (app) => {
        return app['$'].hasOwnProperty('android:usesCleartextTraffic');
      });

      if (application === undefined) {
        application = { '$': {} };
        editConfig.application.push(application);
      }

      application['$']['android:usesCleartextTraffic'] = 'true';

      let xml = builder.buildObject(json);

      fs.writeFileSync(configPath, xml);
    });
  },

  removeAndroidCleartext(project) {
    let cdvPath = cordovaPath(project);
    let configPath = path.join(cdvPath, 'config.xml');

    return parseXml(configPath).then(function(json) {
      delete json.widget['$']['xmlns:android'];

      let platforms = json.widget.platform;

      let androidPlatform = lodash.find(platforms, {
        '$': { name: 'android' }
      });

      if (androidPlatform['edit-config']) {
        let editConfig = lodash.find(androidPlatform['edit-config'], {
          '$': { file: 'app/src/main/AndroidManifest.xml' }
        });

        if (editConfig && editConfig.application) {
          lodash.remove(editConfig.application, (app) => {
            return app['$'].hasOwnProperty('android:usesCleartextTraffic');
          });

          if (editConfig.application.length === 0) {
            delete androidPlatform['edit-config'];
          }
        }
      }

      let xml = builder.buildObject(json);

      fs.writeFileSync(configPath, xml);
    });
  }
};
