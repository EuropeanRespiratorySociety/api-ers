const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');

const def = require('./swagger/auth');


module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Adding swagger to the authentication
  app.configure(Object.assign(authentication(config), {
    docs: def
  }));

  delete app.docs.paths['/authentication/{id}'];
  app.docs.paths['/authentication'].post = Object.assign(
    {}, 
    app.docs.paths['/authentication'].post, def.post);
  app.docs.tags[0].description = def.description;

  // Set up authentication with the secret
  app.configure(jwt());
  app.configure(local(config.local));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
