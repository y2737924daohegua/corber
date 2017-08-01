const RSVP             = require('rsvp');
const chain            = require('lodash').chain;

module.exports = function(validators) {
  return RSVP.allSettled(validators).then(function(result) {
    let errors = chain(result)
      .filter({state: 'rejected'})
      .map('reason')
      .value()

    if (errors.length > 0) {
      let message = 'Validation error(s) \n \n';
      message += errors.join('\n \n');
      return RSVP.reject(message);
    } else {
      return RSVP.resolve();
    }
  });
};
