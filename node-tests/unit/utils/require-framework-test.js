const td               = require('testdouble');
const expect           = require('../../helpers/expect');
const mockProject      = require('../../fixtures/corber-mock/project');
const requireFramework = require('../../../lib/utils/require-framework');
const path             = require('path');

describe('requireFramework util', function() {
  let configPath = path.join(
    mockProject.project.root,
    'corber/config/framework.js'
  );

  afterEach(function() {
    td.reset();
  });

  it('requires framework config', function() {
    let called = false;
    td.replace(configPath, function() {
      called = true;
    });

    requireFramework(mockProject.project);
    expect(called).to.equal(true);
  });

  it('sets root path on framework', function() {
    let framework = requireFramework(mockProject.project);
    expect(framework.root).to.equal(mockProject.project.root);
  });

  it('adds ember/glimmer config for Ember/Glimmer Frameworks', function() {
    let framework = requireFramework(mockProject.project);
    expect(framework.project).to.not.equal(undefined);
  });
});

