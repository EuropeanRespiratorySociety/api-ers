// Initializes the `calendar` service on path `/calendar`
const createService = require('./calendar.class.js');
const hooks = require('./calendar.hooks');

const docs = require('../../swagger/calendar');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'calendar',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/calendar', Object.assign(createService(options), { docs }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('calendar');

  service.hooks(hooks);
};
