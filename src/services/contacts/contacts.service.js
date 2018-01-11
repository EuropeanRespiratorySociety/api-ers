// Initializes the `contacts` service on path `/ers/contacts`
const createService = require('./contacts.class.js');
const hooks = require('./contacts.hooks');
const docs = require('../../swagger/contacts');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'contacts',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ers/contacts', Object.assign(createService(options), { docs }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ers/contacts');

  service.hooks(hooks);
};
