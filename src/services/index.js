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
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  // A -> Z documentation is generated based on this order.
  app.configure(calendar);
  app.configure(contacts);
  app.configure(courses);
  app.configure(login);
  app.configure(metanav);
  app.configure(news);
  app.configure(relatives);
  app.configure(respiratoryMatters);
  app.configure(sleepandbreathing);
  app.configure(users);
  // Has to be last
  app.configure(graphql);
};
