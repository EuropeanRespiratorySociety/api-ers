// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { DateUtils } = require('ers-utils');
const d = new DateUtils();


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    if (hook.method === 'get') {
      if (hook.result.publication_date) {
        hook.result.publication_date = d.ersDate(d.moment(hook.result.publication_date).format('MM/DD/YYYY'));
      }
    }

    if (hook.method === 'find') {
      hook.result.data = hook.result.data.map(i => {
        if (i.publication_date) {
          i.publication_date = d.ersDate(d.moment(i.publication_date).format('MM/DD/YYYY'));
        }
        return i;
      });
    }
    return Promise.resolve(hook);
  };
};
