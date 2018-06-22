// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function (hook) {
    const r = await hook.service.get(hook.id);
    if (r.spotmeId) {
      hook.data.spotmeId = [...new Set([...r.spotmeId, ...hook.data.spotmeId])];
    }
    return Promise.resolve(hook);
  };
};
