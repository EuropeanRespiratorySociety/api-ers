// Initializes the `interests` service on path `/interests`
const createService = require('./interests.class.js');
const hooks = require('./interests.hooks');

const docs = require('../../swagger/interests');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'interests',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/interests', Object.assign(createService(options), { docs }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('interests');

  service.hooks(hooks);
};
