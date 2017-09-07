'use strict';

const path = require('path');
const pkg = require('../../package.json');

const dotenv = require('dotenv');
dotenv.load();

module.exports = {
  docsPath: '/docs',
  version: pkg.version,
  uiIndex: path.join(__dirname, 'docs.html'),
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  info: {
    title: pkg.name,
    description: pkg.description,
    contact:{email:'webmaster@ersnet.org'}
  },
  //basePath: process.env.NODE_ENV === 'local' ? null : process.env.API_URL,
  //basePath: process.env.API_URL,
  securityDefinitions: {
    bearer: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header'
    }
  },
  security: [
    {
      bearer: []
    }
  ]
};