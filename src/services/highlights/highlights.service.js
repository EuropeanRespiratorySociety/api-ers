// Initializes the `highlights` service on path `/highlights`
const createService = require('./highlights.class.js');
const hooks = require('./highlights.hooks');

const docs = require('../../swagger/highlights');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'highlights',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/highlights', Object.assign(createService(options), { docs }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('highlights');

  service.hooks(hooks);
};
