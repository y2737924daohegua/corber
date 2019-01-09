const td          = require('testdouble');
const expect      = require('../../../../helpers/expect');
const mockProject = require('../../../../fixtures/corber-mock/project');
const getAppName  = require('../../../../../lib/targets/cordova/utils/get-app-name');
const { Promise } = require('rsvp');

describe('Get App Name Util', function() {
  beforeEach(function() {
    td.replace('../../../../../lib/targets/cordova/utils/get-config', () => {
      return Promise.resolve({
        widget: {
          name: ['fooApp']
        }
      });
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('should return the correct app name', function() {
    let project = mockProject.project;
    expect(getAppName(project)).to.eventually.equal('fooApp');
  });
});
