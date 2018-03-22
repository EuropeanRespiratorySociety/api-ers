//  const axios = require('axios');
const errors = require('@feathersjs/errors');
const client = require('../../helpers/authentication');
const sureThing = require('../../helpers/sureThing');
const { HTTP, k4Client } = require('../../helpers/HTTP');
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
      const payload = Object.assign({},{ include: conf }, data);
      const crmEndpoint = '/Contacts/Authenticate';
      const crmClient = HTTP('https://crmapi.ersnet.org', params.crmToken);
      const k4Endpoint = '/Agenda/ConferenceCompassAuthentification';
      const k4Request = `${k4Endpoint}?user[username]=${payload.username}&user[password]=${payload.password}`;

      const [myCRM, key4] = await Promise.all([
        sureThing(crmClient.post(crmEndpoint, payload)),
        sureThing(k4Client.get(k4Request))
      ]);

      const key4Token = key4.ok
        ? key4.response.data.user.token
        : 'Something went wrong with Key4 server'; // The key4 error is html... 

      if (!myCRM.ok) {
        const rejected = myCRM.error.response.status === 500
          ? new errors.GeneralError('MyCRM API is probably down, no way to check credentials, please contact the ERS with this message.', { errors: { message: myCRM.error.response.statusText }})
          : new errors.NotAuthenticated('Invalid credentials ', { errors: { message: myCRM.error.response.statusText }});
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
