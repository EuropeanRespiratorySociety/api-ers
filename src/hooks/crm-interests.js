// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const client = require('../helpers/redis');
const { HTTP } = require('../helpers/HTTP');
const sureThing = require('../helpers/sureThing');
const errors = require('@feathersjs/errors');

/* eslint-disable no-console */
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function (hook) {
    return new Promise(async (resolve, reject) => {
      client.get('crmInterests', async (err, reply) => {
        if (reply) {
          // console.log('response from redis: ', reply);
          hook.params.crmInterests = JSON.parse(reply);
          resolve(hook);
        } else {
          const crmClient = HTTP('https://crmapi.ersnet.org', hook.params.crmToken);
          const [a, b] = await Promise.all([
            sureThing(crmClient.get('/Diseases')),
            sureThing(crmClient.get('/Methods'))
          ]);

          const cmsInterests = await hook.app.service('interests').find();
          let interests = {};

          if (a.ok) interests.diseases = a.response.data.map(i => formatName(i, cmsInterests, 'diseases'));
          if (b.ok) interests.methods = b.response.data.map(i => formatName(i, cmsInterests, 'methods'));

          client.set('crmInterests', JSON.stringify(interests));
          hook.params.crmInterests = interests;
          resolve(hook);

          if (!a.ok, !b.ok) {
            console.log('CRM Hook: ', a.error, b.error);
            reject(new errors.GeneralError('MyCRM is probably down, please contact the ERS with this message.', a.error, b.error));
          }
        }
      });
    });
  };
};

function formatName(crmInterestObject, cmsInterestsObject, property) {
  crmInterestObject.Name = cmsInterestsObject.data
    .filter(tmp => tmp.title === property)[0].values
    .filter(i => i.toLowerCase() === crmInterestObject.Name.toLowerCase())[0];
  return crmInterestObject;
}
