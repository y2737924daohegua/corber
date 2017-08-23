const Framework        = require('corber/lib/frameworks/framework');
const Promise          = require('rsvp').Promise;
const logger           = require('corber/lib/utils/logger');

/*
 corber has pre-defined frameworks at ../frameworks/foo

 In some cases your framework  may not be supported,
 or custtomization is easier with a custom object.

 Implementing these base functions will enable use of the CLI.
 Each function should return a Promise.resolve on completion.
 Rejections will be handled, logged as an error and halt the given command
*/

module.exports = Framework.extend({
  afterInstall() {
    /*
      any custom setup after a user has run ec init
      the cordova project already exists
      usually just Promise.resolve()
    */
    logger.warn('afterInstall not implemented');
    return Promise.reject();
  },

  validateBuild() {
    /*
     any validators to run before building
     use this to reject cases where we know cordova will nto work
     e.g. ember will ensure baseURL is not '/'
    */
    logger.warn('afterInstall not implemented');
    return Promise.reject();
  },

  build() {
    //implement the _framework_ build
    logger.warn('afterInstall not implemented');
    return Promise.reject();
  },

  validateServe() {
    /*
     any validators to run before servinb
     use this to reject cases where we know cordova will nto work
     e.g. ember will ensure baseURL is not '/'
    */
    logger.warn('afterInstall not implemented');
    return Promise.reject();
  },

  serve() {
    //implement serve
    logger.warn('afterInstall not implemented');
    return Promise.reject();
  }
});
