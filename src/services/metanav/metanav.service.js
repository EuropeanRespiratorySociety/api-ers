// Initializes the `metanav` service on path `/metanav`
const createService = require('./metanav.class.js');
const hooks = require('./metanav.hooks');

const docs = require('../../swagger/metanav');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'metanav',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/metanav', Object.assign(createService(options), { docs }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('metanav');

  service.hooks(hooks);
};
