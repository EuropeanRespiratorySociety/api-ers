/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.services = ['calendar', 'courses'];
    this.apiUrl = process.env.API_URL;
  }

  async get (id, params) {
    if(!this.services.includes(id)) {
      return {
        filters: {
          user:[],
          system: []
        },
        _sys: {
          status: 204,
          message: `No filters available for service: ${id}`
        }
        
      };
    }

    let user, system;
    if(id == 'calendar') {
      user = [
        {
          url: `${this.apiUrl}/calendar?type=ers`,
          label: 'ERS',
          filter: 'ers'
        },
        {
          url: `${this.apiUrl}/calendar?type=deadline`,
          label: 'ERS Deadlines',
          filter: 'deadline'
        },
        {
          url: `${this.apiUrl}/calendar?type=endorsed`,
          label: 'Endorsed',
          filter: 'endorsed'
        },
        {
          url: `${this.apiUrl}/calendar?type=non-ers`,
          label: 'Non-ERS',
          filter: 'non-ers'
        },
        {
          url: `${this.apiUrl}/calendar?type=all`,
          label: 'All',
          filter: 'all'
        }
      ];
      system = [
        {
          url: `${this.apiUrl}/calendar?type=hermes`,
          label: undefined,
          filter: 'hermes'
        },
        {
          url: `${this.apiUrl}/calendar?type=spirometry`,
          label: undefined,
          filter: 'spirometry'
        }
      ];
    }
    if(id == 'courses') {
      user = [
        {
          url: `${this.apiUrl}/courses?type=all`,
          label: 'All',
          filter: 'all'
        },
        {
          url: `${this.apiUrl}/calendar?type=past`,
          label: 'Past',
          filter: 'past'
        }
      ];
      system = [];
    }

    return {
      filters: {
        user,
        system
      },
      _sys: {
        status: 200
      }
    };
  }

}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
