'use strict';

// src/services/calendar/hooks/prepare-calendar.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const D = require('ers-utils').DateUtils;
const date = new D();

const defaults = {};

module.exports = options => { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return async hook => {
    // hook.prepareCalendar = true;
    const timeline = hook.params.query.timeline == 'true';
    const reverse = hook.params.query.reverse == 'true';
    const limit = parseInt(hook.params.query.limit) || null; 
    /* eslint-disable indent */
    hook.result.data = !hook.result._sys.status === 200 
      ? {}
      : timeline
      ? date.timeline(hook.result.data)
      : date.prepareCalendar(hook.result.data, reverse);
    /* eslint-enable */
    
    /* 
    * @TODO remove this when we can directly get better results from Cloud CMS
    * This is not really precise, has we first filter all items, then keep
    * only the x first items. Skipping will be a painful operation ;)
    */
    if(limit) {
      hook.result.data = hook.result.data.slice(0, limit);
    }

    return hook;
  };
};
