'use strict';

const errors = require('@feathersjs/errors');

const defaults = {};

/* eslint-disable no-console */
exports.isOwner = options => { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return async hook => {
    return hook.id !== hook.params.payload.userId
      ? er()
      : hook;
  };      
};

function er() {
  throw new errors.Forbidden('You are not allowed to view this resource');
}