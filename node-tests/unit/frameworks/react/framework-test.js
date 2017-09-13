const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const mockProject    = require('../../../fixtures/corber-mock/project');

describe('React Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('has required props', function() {
    let React = require('../../../../lib/frameworks/react/framework');
    let framework = new React();

    expect(framework.name).to.equal('react');
    expect(framework.buildCommand).to.equal('npm run build');
    expect(framework.buildPath).to.equal('./build');
    expect(framework.port).to.equal(3000);
  });

  it('build initializes a new BuildTask', function() {
    let BuildTask = td.replace('../../../../lib/frameworks/react/tasks/build');
    let buildDouble = td.replace(BuildTask.prototype, 'run');
    let React = require('../../../../lib/frameworks/react/framework');

    let framework = new React();

    framework.build({cordovaOutputPath: 'fakePath'});
    td.verify(new BuildTask({
      cordovaOutputPath: 'fakePath',
      buildCommand: 'npm run build',
      buildPath: './build'
    }));

    td.verify(buildDouble());
  });

  it('serve intializes a new ServeTask', function() {
    let ServeTask = td.replace('../../../../lib/frameworks/react/tasks/serve');
    let serveDouble = td.replace(ServeTask.prototype, 'run');
    let React = require('../../../../lib/frameworks/react/framework');

    let framework = new React();

    framework.serve({platform: 'ios'});
    td.verify(new ServeTask());

    td.verify(serveDouble('ios'));
  });
});
