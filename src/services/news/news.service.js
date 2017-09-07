// Initializes the `news` service on path `/news`
const createService = require('./news.class.js');
const hooks = require('./news.hooks');
const filters = require('./news.filters');

const docs = require('../../swagger/news');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'news',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/news', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('news');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
