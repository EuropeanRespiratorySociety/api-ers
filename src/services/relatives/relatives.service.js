// Initializes the `relatives` service on path `/relatives`
const createService = require('./relatives.class.js');
const hooks = require('./relatives.hooks');
const filters = require('./relatives.filters');

const docs = require('../../swagger/relatives');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'relatives',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/relatives', Object.assign(createService(options), {
    docs,
    id: 'slug'
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('relatives');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
