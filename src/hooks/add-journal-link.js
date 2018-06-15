// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    const { $limit = undefined, journal_url = undefined } = hook.params.query || { $limit: undefined, journal_url: undefined};
    if($limit < 10 && journal_url) {
      hook.result.data.push({
        title:'&nbps;',
        abstract: `<a href="${journal_url}">Vist Journal Website</a>`
      });
    }
    return Promise.resolve(hook);
  };
};
