'use strict';

// src/services/content/hooks/cc-parser.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html


const defaults = {};
const F = require('ers-utils').Format;
const D = require('ers-utils').DateUtils;
const d = new D();
const f = new F();


exports.filterByType = function(options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return function(hook) {
    if (hook.result._sys.status === 200 && hook.params.options) {
      if (hook.params.options.type === 'current') {
        hook.result.data = 
          sort(hook.result.data.filter(i => !d.isAlreadyPassed(i.eventDate) || !d.isAlreadyPassed(i.eventEndDate)));
      } 

      if (hook.params.options.type === 'past') {
        hook.result.data = sort(hook.result.data.filter(i => 
          d.isAlreadyPassed(i.eventDate) && checkEndDate(i)
        ));
      }

      if (hook.params.options.type === 'all') {
        hook.result.data = sort(hook.result.data);
      } 
    }
    return Promise.resolve(hook);
  };
};

/**
 * Sort the array of returned object by timestamp
 * @param {Object[]} array 
 */
function sort(array) {
  return f.loadash.sortBy(array, i => i.startDateTimestamp);
}

/**
 * Check if the end date exists, then if it is passed. If the
 * end date does not exist, uses the start date. 
 * This is done in purpose one day events
 * @param {Object} item 
 */
function checkEndDate(item){
  return item.eventEndDate !== undefined ? d.isAlreadyPassed(item.eventEndDate) : d.isAlreadyPassed(item.eventDate);
}

