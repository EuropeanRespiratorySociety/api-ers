// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    const { diseases = undefined, methods = undefined } = hook.data;
    hook.data = {
      $push: {
        reviewers: {
          ersId: hook.params.user.ersId,
          diseases,
          methods
        }
      }
    };
    return Promise.resolve(hook);
  };
};
