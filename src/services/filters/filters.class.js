/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.services = ['calendar', 'courses'];
  }

  async get (id, params) {
    if(!this.services.includes(id)) {
      return {
        _sys: {
          status: 204,
        },
        message: `No filters available for service: ${id}`
      };
    }

    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
