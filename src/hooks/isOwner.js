'use strict';

const errors = require('feathers-errors');

const defaults = {};

/* eslint-disable no-console */
exports.isOwner = function(options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return function(hook) {
    return new Promise((resolve) => {
      if(hook.id !== hook.params.user._id.toString()) {
        const notAuthorized = new errors.Forbidden('You are not allowed to view this resource');
        throw notAuthorized;
      }
      resolve(hook);
    });     
  };      
};