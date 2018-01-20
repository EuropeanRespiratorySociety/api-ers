// Initializes the `respiratory-matters` service on path `/respiratory-matters`
const createService = require('../../helpers/service.class');
const hooks = require('./respiratory-matters.hooks');

const docs = require('../../swagger/respiratory-matters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'respiratory-matters',
    qname: 'o:d571c1fa5c4b8ed6d7ac',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/respiratory-matters', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('respiratory-matters');

  service.hooks(hooks);
};
