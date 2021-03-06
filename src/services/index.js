const relatives = require('./relatives/relatives.service.js');
const users = require('./users/users.service.js');
const metanav = require('./metanav/metanav.service.js');
const courses = require('./courses/courses.service.js');
const calendar = require('./calendar/calendar.service.js');
const news = require('./news/news.service.js');
const respiratoryMatters = require('./respiratory-matters/respiratory-matters.service.js');
// const graphql = require('./graphql/graphql.service.js');
const login = require('./login/login.service.js');
const contacts = require('./contacts/contacts.service.js');
const sleepandbreathing = require('./sleepandbreathing/sleepandbreathing.service.js');
const preferences = require('./preferences/preferences.service.js');
const interests = require('./interests/interests.service.js');
const filters = require('./filters/filters.service.js');
const publications = require('./publications/publications.service.js');
const vision = require('./vision/vision.service.js');
const webhook = require('./webhook/webhook.service.js');
const leadership = require('./leadership/leadership.service.js');
const sessions = require('./sessions/sessions.service.js');
const presentations = require('./presentations/presentations.service.js');
const abstracts = require('./abstracts/abstracts.service.js');
const feed = require('./feed/feed.service.js');
const highlights = require('./highlights/highlights.service.js');
const journals = require('./journals/journals.service.js');
const search = require('./search/search.service.js');
const appHighlights = require('./app-highlights/app-highlights.service.js');
const notification = require('./notification/notification.service.js');
const appCommunity = require('./app-community/app-community.service.js');
const trainingData = require('./training-data/training-data.service.js');
const cpd = require('./cpd/cpd.service.js');
const recommend = require('./recommend/recommend.service.js');
const cmeOnline = require('./cme-online/cme-online.service.js');
const respiratoryDigest = require('./respiratory-digest/respiratory-digest.service.js');

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  // A -> Z documentation is generated based on this order.
  app.configure(appCommunity);
  app.configure(appHighlights);
  app.configure(calendar);
  app.configure(cpd);
  app.configure(sessions); // this appears under "congress"
  app.configure(presentations); // this appears under "congress"
  app.configure(abstracts); // this appears under "congress"
  app.configure(cmeOnline);
  app.configure(courses);
  app.configure(contacts); // This shows up as ers in the documentation
  app.configure(feed);
  app.configure(filters);
  app.configure(highlights);
  app.configure(interests);
  app.configure(journals);
  app.configure(leadership);
  app.configure(login); // This is merged with the previous one
  app.configure(metanav);
  app.configure(news);
  app.configure(notification);
  app.configure(preferences);
  app.configure(publications);
  app.configure(relatives);
  app.configure(respiratoryDigest);
  app.configure(respiratoryMatters);
  app.configure(search);
  app.configure(sleepandbreathing);
  app.configure(trainingData);
  app.configure(users);
  app.configure(vision);
  app.configure(webhook);
  // Has to be last
  // For now graphql endpoint is offline
  // app.configure(graphql);
  app.configure(recommend);
};
