const request = require('request-promise');


/* eslint-disable no-unused-vars */
module.exports = function Resolvers() {

  const app = this;

  const Relatives = app.service('relatives');
  const Users = app.service('users');
  // const Viewer = app.service('viewer');
  const News = app.service('news');
  const rm = app.service('respiratory-matters');
  // const calendar = app.service('calendar');
  const Courses = app.service('courses');
  // const Contacts = app.service('contacts');

  const localRequest = request.defaults({
    baseUrl: `http://${app.get('host')}:${app.get('port')}`,
    json: true
  });

  return {
    // Users: {

    // },

    // Article: {

    // },

    AuthPayload: {
      data(auth, args, context) {
        return auth.data;
      }
    },

    RootQuery: {
      users(root, args, context) {
        return Users
          .find(context)
          .then(results => results.data);
      },

      user(root, { _id }, context) {
        return Users.get(_id, context);
      }, 

      // contacts(root, { pattern }, context) {
      //     return Contacts.find({query:{pattern:pattern}}, context)
      //                     .then(results => results.data);
      // },  

      // contact(root, { contactId }, context) {
      //     const params = { query:{}};
      //     return Contacts.get(contactId, params)
      //                     .then(results => results.data);
      // },  
        
      // viewer(root, args, context) {
      //   return Viewer.find(context);
      // },

      relatives(root, { qname, full } , context) {
        return Relatives
          .find({query:{qname: qname, full: full || false}})
          .then(results => results.data);
      },

      article(root, { slug } , context) {
        const params = { query:{}};
        return Relatives
          .get(slug, params)
          .then(results => results.data);
      },

      news(root, { full=false, sortDirection=-1, sortBy='_system.modified_on.ms', limit=25, skip=0 } , context) {
        const params = {
          query: {
            full: full,
            sortDirection: sortDirection,
            sortBy: sortBy,
            limit: limit,
            skip: skip
          }
        };
        return News
          .find(params)
          .then(results => results.data);
      },

      // calendar(root, { type, full, limit, skip } , context) {
      //   const params = {
      //     query: {
      //       type: type,
      //       full: full,
      //       limit: limit,
      //       skip: skip
      //     }
      //   }
      //   return calendar.find(params)
      //                   .then(results => results.data);
      // },

      courses(root, { full, limit, skip } , context) {
        const params = {
          query: {
            full: full,
            limit: limit,
            skip: skip
          }
        };
        return Courses
          .find(params)
          .then(results => results.data);
      },

      respiratoryMatters(root, { full, limit, skip } , context) {
        const params = {
          query: {
            full: full || false,
            limit: limit,
            skip: skip
          }
        };
        return rm
          .find(params)
          .then(results => results.data);
      }
    },

    RootMutation: {
    //   signUp(root, args, context) {
    //     return Users.create(args)
    //   },
      logIn(root, {email, password, strategy}, context) {
        return localRequest({
          uri: '/authentication',
          method: 'POST',
          body: { email:email, password:password, strategy:strategy }
        });
      }
    //   createArticle(root, {article}, context) {
    //     return Articles.create(article, context);
    //   },
    //   removeArticle(root, { _id }, context) {
    //     return Articles.remove(_id, context);
    //   },
    }

  };
};

