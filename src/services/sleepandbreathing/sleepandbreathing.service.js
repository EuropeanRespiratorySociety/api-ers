// Initializes the `sleepandbreathing` service on path `/sleepandbreathing`
const createService = require('./sleepandbreathing.class.js');
const hooks = require('./sleepandbreathing.hooks');

const docs = require('../../swagger/sleep-and-breathing');
module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'sleepandbreathing',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sleepandbreathing',  Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('sleepandbreathing');

  service.hooks(hooks);
};
