// Initializes the `cdp` service on path `/cdp`
const createService = require('../../helpers/service.class');
const hooks = require('./cdp.hooks');
const docs = require('../../swagger/cpd');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'cpd',
    qname: 'o:f0f71ccdb9a084463b5b',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/cdp', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('cdp');

  service.hooks(hooks);

  // if (service.filter) {
  //   service.filter(filters);
  // }
};
