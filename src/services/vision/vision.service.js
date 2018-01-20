// Initializes the `ers-vision` service on path `/ers-vision`
const createService = require('../../helpers/service.class');
const hooks = require('./vision.hooks');

const docs = require('../../swagger/vision');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'vision',
    qname: 'o:0cbccec1fe46232dabb3',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vision', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vision');

  service.hooks(hooks);
};
