const getConfig = require('./get-config');

module.exports = function(project) {
  return getConfig(project).then((config) => {
    return config.widget.name[0];
  });
};
