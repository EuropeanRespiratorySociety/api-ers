/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const f = require('../../helpers/formatNotification');
const r = require('../../helpers/requests');
const { spotmeClient } = require('../../helpers/HTTP');
const dotenv = require('dotenv');
dotenv.load();

class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }  

  async create (data, params) {
    const branch = global.cloudcms;
    const allowedSenders = [ 
      '869b74f51afe687b5b74/26c55c7f5b3902da7cc', // Sam2
      '869b74f51afe687b5b74/88974524daffaab64181', // Dawn
      '869b74f51afe687b5b74/8c5cee229733b59b886f', // Tamki
      '869b74f51afe687b5b74/b0b92beef2f4044f4876', // Beth
      '869b74f51afe687b5b74/e00928e3e82b80adb710', // Steph
      '869b74f51afe687b5b74/b053fcddb8b70b299821',  // Sam
      '869b74f51afe687b5b74/182db480d8e9428e229d',  // Tim
    ];

    return new Promise(async (resolve, reject) => {
      if (params.query.pw !== process.env.WPW) {
        reject(new errors.Forbidden({message: 'password did not match'}));
      }

      const { 
        modified_by,
        modified_by_principal_domain_id,
        modified_by_principal_id
      } = data._cloudcms.node.object._system;
      const { _doc, sent = false } = data._cloudcms.node.object;
      const allowed = allowedSenders.includes(`${modified_by_principal_domain_id}/${modified_by_principal_id}`);

      if(modified_by.includes('appuser-')) {
        reject(new errors.Forbidden({message: 'system call, rejected'}));
        return;
      }

      if (!allowed) {
        const message = `${modified_by}, you are not allowed to send app notifications`;
        // no need to wait for the reply
        r.addComment(branch, {_doc}, message );
        reject(new errors.Forbidden({message}));
        return;
      }

      if (sent) {
        const message = `${modified_by}, this notification has already been sucessfully sent, aborting.`;
        r.addComment(branch, {_doc}, message );
        reject(new errors.BadRequest({message}));
        return;
      }

      const notification = f(data);
      if (!notification) {
        const message = 'Notifications need to be published';
        // no need to wait for the reply
        r.addComment(branch, {_doc}, message );
        reject(new errors.BadRequest({message}));
        return;
      }

      // post notification to spotme
      if (allowed && notification) {
        const result = await spotmeClient.post(null, notification);
        if(result.data.ok) {
          const message = `the notification has been sent/scheduled | notification id: ${result.data.id} status: ${result.status}`;
          await r.addComment(branch, {_doc}, message );
          await r.updateNode(branch, _doc, {sent: true});
          resolve({data: result.data, status: result.status});
          return;
        } else {
          const message =  `something went wrong | notification id: ${result.data.id} status: ${result.status}`;
          await r.addComment(branch, {_doc}, message );
          reject(new errors.BadRequest({data: result.data, status: result.status}));
          return;
        }
      }

    });
  }

  // remove (id, params) {
  //   return Promise.resolve({ id });
  // }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
