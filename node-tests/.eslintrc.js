/* jshint node: true */
// ht ember-cli

module.exports = {
  globals: {
    'describe': true,
    'it': true,
    'beforeEach': true,
    'afterEach': true,
    'context': true
  },
  rules: {
    'max-len': [2, { 'ignoreUrls': true, 'code': 120 }],
    'no-unused-expressions': 'off'
  }
};
