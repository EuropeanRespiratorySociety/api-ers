/* eslint-disable no-unused-vars */
const h = require('./webhook.helpers');
const cache = require('./webhook.cache');
const errors = require('@feathersjs/errors');
//  making sure it .env is loaded
const dotenv = require('dotenv');
dotenv.load();

class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const type = params.query.type;
    const congress = params.query.year;
    const pw = params.query.pw;
    const e = params.query.e;
    const force = params.query.force == 'true' ? true : false;
    const printErrors = params.query.errors == 'true' ? true : false;
    const seeding = params.query.seeding == 'true' ? true : false; // this param will create problem is you seed twice...
    
    // Basic protection of the endpoint
    if(pw !== process.env.WPW) {
      throw new errors.Forbidden('The password did not match. You are not authorized to use this webhook');
    }
    
    if (type === 'save-congress-sessions') {
      return h.upsertSessions(this.app, congress, e, seeding);
    }

    if (type === 'save-congress-presentations') {
      h.upsertPresentations(this.app, congress, e, seeding);
      return {message: 'This process runs for a long time, check the logs in ES to know where we are at'};
    }

    if (type === 'save-congress-abstracts') {
      return h.upsertAbstracts(this.app, congress, e, seeding, force);
    }

    if (type === 'index-congress-abstracts') {
      return h.indexCongress(this.app, 'abstracts', congress);
    }

    if (type === 'index-congress-abstracts') {
      return h.indexCongress(this.app, 'abstracts', congress);
    }

    if (type === 'index-congress-presentations') {
      return h.indexCongress(this.app, 'presentations', congress);
    }

    if (type === 'index-ers-content') {
      return h.indexErsContent(this.app, 'ers:article', printErrors);
    }

    if (type === 'index-sb-content') {
      return h.indexErsContent(this.app, 'sb:article');
    }

    if (type === 'index-journals') {
      return h.indexJournals(this.app, printErrors);
    }

    return 'no such processing available';
  }

  async create (data, params) {
    const type = params.query.type;
    const pw = params.query.pw;
    const force = params.query.force == 'true' ? true : false;
    // console.log(data)
    // console.log(params, 'pw: ', pw, ' ', process.env.WPW)
    // if(pw !== process.env.WPW) {
    //   throw new errors.Forbidden('The password did not match. You are not authorized to use this webhook');
    // }
    // if action create
    // -- send to index
    // -- process the data in NLP pipeline
    // write to grakn
    // return type === 'cache'
    //   ? h.cache(data)
    //   : 'other method not yet implemented';
    if (type === 'cache') {
      return cache.clear(data);
    }

    if(pw !== process.env.WPW) {
      throw new errors.Forbidden('The password did not match. You are not authorized to use this webhook');
    }

    if (type === 'save-journal-abstract') {
      return h.upsertJournalAbstract(this.app, data, force );
    }
  }

  // async update (id, data, params) {
  //   return data;
  // }

  // async patch (id, data, params) {
  //   return data;
  // }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;