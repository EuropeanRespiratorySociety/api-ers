// Initializes the `app-highlights` service on path `/app-highlights`
const createService = require('../../helpers/service.class');
const hooks = require('./app-highlights.hooks');
// const filters = require('./app-highlights.filters');

const docs = require('../../swagger/app-highlights');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  
  const options = {
    name: 'app-highlights',
    qname: 'o:ec586ddd9c918191be2b',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/app-highlights', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('app-highlights');

  service.hooks(hooks);
};
