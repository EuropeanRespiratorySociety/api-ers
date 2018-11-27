/*eslint no-console: off*/
const chalk = require('chalk');
const r = require('../../helpers/requests');
const errors = require('@feathersjs/errors');
const dotenv = require('dotenv');
dotenv.load();
const gmClient = require('@google/maps').createClient({
  key: process.env.GMAPS,
  Promise: Promise
});

class Coordinates {

  async generate(data) {
    const {venue = {}}= data._cloudcms.node.object;
    const {streetAddress='', streetAddress2='', city = '', postalCode = '',country =''} = venue;
    // Geocode an address.
    return gmClient.geocode({
      address: `
          ${streetAddress} 
          ${streetAddress2} 
          ${postalCode} 
          ${city} 
          ${country}`})
      .asPromise()
      .then(response => response.json.results[0].geometry)
      .catch(error => {
        console.log(error);
        throw new errors.GeneralError('Something bad happened', error);
      });
  }

  async save(coordinates, data) {
    const branch = global.cloudcms;
    const {_doc = false}= data._cloudcms.node.object;
    if(!_doc) {
      console.log('_doc is missing');
      throw new errors.BadRequest('_doc is missing'); 
    }

    const payload = {
      loc:{
        lat: coordinates.location.lat,
        long: coordinates.location.lng
      }
    }

    const result = await r.updateNode(branch, _doc, payload);
    if(!result.ok) {
      throw new errors.GeneralError('Something went wrong', result.message);
    }
    return result;





  }




}

module.exports = new Coordinates();