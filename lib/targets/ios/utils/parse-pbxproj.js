const { Xcode } = require('pbxproj-dom/xcode');
const fsUtils   = require('../../../utils/fs-utils');

module.exports = function(path, appName) {
  if (!fsUtils.existsSync(path)) {
    throw `pbxproj file does not exist at ${path}`;
  }

  let pbxproj;
  try {
    pbxproj = Xcode.open(path);
  } catch (err) {
    throw `failed to parse pbxproj file at ${path}`;
  }

  let target;
  let project = pbxproj.document.projects.find((p) => {
    target = p.targets.find(t => t.name === appName);
    return target;
  });

  if (!target) {
    throw 'no build target found for app ${appName} in pbxproj file at '
      + ` ${path}`;
  }

  let targetAttributes = project.ast.get('attributes')
    .get('TargetAttributes')
    .get(target.key);

  let provisioningStyle = targetAttributes.get('ProvisioningStyle').text;
  if (provisioningStyle) {
    provisioningStyle = provisioningStyle.toLowerCase();
  } else {
    provisioningStyle = 'automatic';
  }

  let developmentTeam, buildConfigurations;
  if (provisioningStyle === 'automatic') {
    developmentTeam = targetAttributes.get('DevelopmentTeam').text;
  } else {
    let pbxBuildConfigs = target.buildConfigurationsList.buildConfigurations;
    buildConfigurations = pbxBuildConfigs.reduce((hash, config) => {
      let key = config.name.toLowerCase();
      let buildSettings = config.ast.get('buildSettings');
      let provisioningProfile = buildSettings.get('PROVISIONING_PROFILE').text;

      hash[key] = {
        name: key,
        provisioningProfile
      };

      return hash;
    }, {});
  }

  return {
    provisioningStyle,
    developmentTeam,
    buildConfigurations
  };
};
