/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }  

  find (params) {
    return new Promise((resolve, reject) => {
      const features = ['ers:methods','ers:diseases'];

      global.cloudcms
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })
        .then(function() {
          this.listDefinitions('feature').then(function() {
            const interests = JSON
              .parse(JSON.stringify(this.asArray()))
              .filter(i =>
                features.indexOf(i.description) !== -1 
              )
              .map(i => {
                const type = i.description.split(':')[1];
                return {
                  title: type,
                  values: i.properties[type].items.enum,
                  limits: {
                    min: i.properties.limits.properties.min.default,
                    max: i.properties.limits.properties.max.default
                  }
                };
              });
            
            resolve(interests);
          });
        });
    });      
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
