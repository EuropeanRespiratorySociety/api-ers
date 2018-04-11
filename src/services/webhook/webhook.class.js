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

    /* eslint-disable indent */
    return pw !== process.env.WPW
      ? error()
      : type === 'save-congress-sessions'
      ? h.upsertSessions(this.app, congress, e, seeding)
      : type === 'save-congress-presentations'
      ? presentations(this.app, congress, e, seeding)
      : type === 'save-congress-abstracts'
      ? h.upsertAbstracts(this.app, congress, e, seeding, force)
      : type === 'index-congress-abstracts'
      ? h.indexCongress(this.app, 'abstracts', congress)
      : type === 'index-congress-sessions'
      ? h.indexCongress(this.app, 'sessions', congress)
      : type === 'index-congress-presentations'
      ? h.indexCongress(this.app, 'presentations', congress)
      : type === 'index-ers-content'
      ? h.indexErsContent(this.app, 'ers:article', printErrors)
      : type === 'index-sb-content'
      ? h.indexErsContent(this.app, 'sb:article')
      : type === 'index-journals'
      ? h.indexJournals(this.app, printErrors)
      : 'no such processing available';
    /* eslint-enable indent */
  }

  async create (data, params) {
    const type = params.query.type;
    const pw = params.query.pw;
    const force = params.query.force == 'true' ? true : false;
    // console.log(data)
    // console.log(params, 'pw: ', pw, ' ', process.env.WPW)

    // if (type === 'cache' || isCloudCMS(data)) {
    //   return cache.clear(data);
    // }

    /* eslint-disable indent */
    return pw !== process.env.WPW && !isCloudCMS(data)
      ? error()
      : type === 'cache' || isCloudCMS(data)
      ? cache.clear(data)
      : type === 'save-journal-abstract'
      ? h.upsertJournalAbstract(this.app, data, force )
      : 'other method not yet implemented';
    /* eslint-enable indent */
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

function isCloudCMS (data) {
  return data.hasOwnProperty('_cloudcms');
}

function error() {
  throw new errors.Forbidden('The password did not match. You are not authorized to use this webhook');
}

function presentations(app, congress, e, seeding) {
  h.upsertPresentations(app, congress, e, seeding);
  return { message: 'This process runs for a long time, check the logs in ES to know where we are at' };
}