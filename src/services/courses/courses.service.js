// Initializes the `course` service on path `/course`
const createService = require('../../helpers/service.class');
const hooks = require('./courses.hooks');

const docs = require('../../swagger/courses');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'courses',
    qname: 'o:f913cff03624ac461283',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/courses', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('courses');

  service.hooks(hooks);
};
