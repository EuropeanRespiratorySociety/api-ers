// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    console.log(hook)
    const user = hook.params.user;
    console.log(user)
    hook.data._id = user._id;
    hook.data.ersId = user.ersId;
    return Promise.resolve(hook);
  };
};
