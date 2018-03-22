'use strict';
const defaults = {};
const errors = require('@feathersjs/errors');
const qs = require('querystring');
const axios = require('axios');
const client = require('../helpers/redis');
const dotenv = require('dotenv');
dotenv.load();

const data = qs.stringify({ 
  grant_type: 'password',
  username: process.env.CRM_USER,
  password: process.env.CRM_PW
});

/* eslint-disable no-console */
exports.crmAuth = function(options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return function(hook) {
    return new Promise((resolve, reject) => {
      client.get('myCrm_api_key', (err, reply) => {
        if(reply) {
          //console.log("response from redis: ", reply)
          hook.params.crmToken = reply;
          resolve(hook);
        } else {
          axios
            .post('https://crmapi.ersnet.org/Token', data)
            .then(response => {
              client.set('myCrm_api_key', response.data.access_token);
              client.expire('myCrm_api_key', response.data.expires_in - 30 );
              hook.params.crmToken = response.data.access_token;
              resolve(hook);
            })
            .catch(error => {
              console.log('CRM Hook: ', error);
              reject(new errors.GeneralError('MyCRM is probably down, please contact the ERS with this message.'));
            });
        }
      });
    });     
  };      
};


