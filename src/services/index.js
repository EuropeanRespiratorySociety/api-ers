const relatives = require('./relatives/relatives.service.js');
const users = require('./users/users.service.js');
const metanav = require('./metanav/metanav.service.js');
const courses = require('./courses/courses.service.js');
const calendar = require('./calendar/calendar.service.js');
const news = require('./news/news.service.js');
const respiratoryMatters = require('./respiratory-matters/respiratory-matters.service.js');
const graphql = require('./graphql/graphql.service.js');
const login = require('./login/login.service.js');
const contacts = require('./contacts/contacts.service.js');
const sleepandbreathing = require('./sleepandbreathing/sleepandbreathing.service.js');
const preferences = require('./preferences/preferences.service.js');
const interests = require('./interests/interests.service.js');
const filters = require('./filters/filters.service.js');
const publications = require('./publications/publications.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  // A -> Z documentation is generated based on this order.
  app.configure(calendar);
  app.configure(courses);
  app.configure(contacts); // This shows up as ers in the documentation
  app.configure(filters);
  app.configure(interests);
  app.configure(login); // This is merged with the previous one
  app.configure(metanav);
  app.configure(news);
  app.configure(preferences);
  app.configure(publications);
  app.configure(relatives);
  app.configure(respiratoryMatters);
  app.configure(sleepandbreathing);
  app.configure(users);
  // Has to be last
  app.configure(graphql);
};
