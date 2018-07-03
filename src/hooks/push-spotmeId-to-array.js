// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function (hook) {
    const { spotmeId = false } = await hook.service.get(hook.id);
    if (spotmeId) {
      // legacy checks (we switched from string to array)
      const id = Array.isArray(spotmeId) ? spotmeId : [spotmeId];
      const newId = Array.isArray(hook.data.spotmeId) ? hook.data.spotmeId : [hook.data.spotmeId];
      hook.data.spotmeId = [...new Set([...id, ...newId])];
    }
    return Promise.resolve(hook);
  };
};
