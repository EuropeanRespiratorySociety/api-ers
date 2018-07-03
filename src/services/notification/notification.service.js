// Initializes the `notification` service on path `/notification`
const createService = require('./notification.class.js');
const hooks = require('./notification.hooks');
// const filters = require('./notification.filters');

const docs = require('../../swagger/notification');

module.exports = function () {
  const app = this;

  const options = {
    name: 'notification'
  };

  // Initialize our service with any options it requires
  app.use('/notification', Object.assign(createService(options), {
    docs
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('notification');

  service.hooks(hooks);

  // if (service.filter) {
  //   service.filter(filters);
  // }
};
