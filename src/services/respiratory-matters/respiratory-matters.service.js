// Initializes the `respiratory-matters` service on path `/respiratory-matters`
const createService = require('./respiratory-matters.class.js');
const hooks = require('./respiratory-matters.hooks');

const docs = require('../../swagger/respiratory-matters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'respiratory-matters',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/respiratory-matters', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('respiratory-matters');

  service.hooks(hooks);
};
