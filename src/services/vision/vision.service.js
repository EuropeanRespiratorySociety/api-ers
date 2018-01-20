// Initializes the `ers-vision` service on path `/ers-vision`
const createService = require('./vision.class.js');
const hooks = require('./vision.hooks');

const docs = require('../../swagger/vision');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'vision',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vision', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vision');

  service.hooks(hooks);
};
