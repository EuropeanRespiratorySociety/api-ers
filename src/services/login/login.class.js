const axios = require('axios');
const errors = require('@feathersjs/errors');
const client = require('../../helpers/authentication');
const sureThing = require('../../helpers/sureThing');
const conf = require('./login.conf').join(',');

// @TODO async/await #26
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    return new Promise(async (resolve, reject) => {
      const myCrmUrl = 'https://crmapi.ersnet.org/Contacts/Authenticate';
      const key4Url = 'http://k4.ersnet.org/prod/v2/Front/Agenda/ConferenceCompassAuthentification';
      const payload = Object.assign({},{ include: conf }, data);

      const [myCRM, key4events] = await Promise.all([
        sureThing(axios
          .post(myCrmUrl, 
            payload, 
            {
              headers: { Authorization: `Bearer ${params.crmToken}` 
              } // The token is generated/set by a hook
            })),
        sureThing(axios
          .get(`${key4Url}?user[username]=${payload.username}&user[password]=${payload.password}`))
      ]);

      const key4Token = key4events.response.data.user
        ? key4events.response.data.user.token
        : key4events.response.data; // Here should be any error. Key4 is not returning correct http status... thus catch does not work

      if (!myCRM.ok) {
        const rejected = new errors.NotAuthenticated('Invalid credentials ', { errors: { message: myCRM.error.Message, key4Token }});
        reject(rejected);
      }
      
      if(myCRM.ok){
        const data = myCRM.response.data;
        const contactId = data.ContactId;
        const users = this.app.service('users');
        const params = {
          query: {
            ersId: contactId
          },
          mongoose: { upsert: true }
        };
        
        const user = {
          email: data.SmtpAddress1,
          ersId: contactId,
          key4Token,
          password: payload.password,
          permissions: 'myERS'
        };

        // Update or create the user (upsert)
        users.patch(null, user, params).then( u => {
          if(u && u.length === 0) {
            reject(new errors.NotFound(data));
          }

          // automatically authenticate the user
          client.authenticate({
            email: data.SmtpAddress1,
            password: payload.password,
            strategy: 'local'
          }).then(r => {
            const apiUserId = u[0]._id.toString();
            const spotmeId = u[0].spotmeId || '';
            const preferences = this.app.service('preferences');
            preferences.get(apiUserId).then(p => {
            // @TODO #25 we need to merge the preferences with myCRM store preferences
              resolve(Object.assign({data: data}, r, { apiUserId, key4Token, spotmeId, preferences: p }));
            }).catch(err => {
              resolve(Object.assign({data: data}, r, { apiUserId, key4Token, spotmeId, preferences: {} }));
            });
          });
        }).catch(e => {
          reject(new errors.GeneralError(e));
        });
      } else {
        reject(new errors.NotFound(myCRM.data));
      }
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
