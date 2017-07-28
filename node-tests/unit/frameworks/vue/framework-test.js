const td             = require('testdouble');
const expect         = require('../../../helpers/expect');

describe('Ember Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('has required props', function() {
    let Vue = require('../../../../lib/frameworks/vue/framework');
    let framework = new Vue();

    expect(framework.name).to.equal('vue');
    expect(framework.buildCommand).to.equal('npm run build dev');
    expect(framework.buildPath).to.equal('./dist');
    expect(framework.port).to.equal(8080);
  });

  it('build initializes a new BuildTask', function() {
    let BuildTask = td.replace('../../../../lib/frameworks/vue/tasks/build');
    let buildDouble = td.replace(BuildTask.prototype, 'run');
    let Vue = require('../../../../lib/frameworks/vue/framework');

    let framework = new Vue();

    framework.build({cordovaOutputPath: 'fakePath'});
    td.verify(new BuildTask({
      cordovaOutputPath: 'fakePath',
      buildCommand: 'npm run build dev',
      buildPath: './dist'
    }));

    td.verify(buildDouble());
  });

  it('serve intializes a new ServeTask', function() {
    let ServeTask = td.replace('../../../../lib/frameworks/vue/tasks/serve');
    let serveDouble = td.replace(ServeTask.prototype, 'run');
    let Vue = require('../../../../lib/frameworks/vue/framework');

    let framework = new Vue();

    framework.serve();
    td.verify(new ServeTask());

    td.verify(serveDouble());
  });
});
