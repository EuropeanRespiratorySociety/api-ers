const chalk = require('chalk');
const client = require('../../helpers/redis');
const { promisify } = require('util');
const { Format } = require('ers-utils');
const format = new Format();

const getAsync = promisify(client.get).bind(client);

const m = require('moment');
const es = require('../../helpers/elastic.js');
const addToES = require('./webhook.config').addToES;

const errors = require('@feathersjs/errors');
const HTTP = require('../../helpers/HTTP');
// @TODO: remove - we need this one temporarily while we bust the ERS Website
const axios = require('axios');

class Helpers {
  constructor() {
    this.client = HTTP(process.env.API_URL);
  }

  async cache (data) {
    const item = data._cloudcms.node.object;
    // Getting the item from the cache
    const reply = JSON.parse(await getAsync(item.slug));
  
    if(reply) {
      const group = reply.cache.group.split('-')[1];
      // temporary, we (try) clean the ers main website cache
      const a = axios.post(`https://www.ersnet.org/cache?url=${reply.data.url}`);
      // the cache is not always busted: @TODO fix it! issue #24 
      const b = this.client.get(`/cache/clear/single/${reply.cache.key}`);
      const c = this.client.get(`/cache/clear/group/${group}`);
      const [ta, tb, tc] = await Promise.all([a, b, c]);
      
      const result = {
        timestamp :  m().format('x'),
        date: new Date(),
        item: {
          title: item.title,
          _doc: item._doc,
        },
        website: ta.data,
        api: {
          single: tb.data,
          group: tc.data
        }
      }; 
      // eslint-disable-next-line no-console
      // console.log(result);
      
      // 1. use cache status (200) to push to log index in ES
      await es.log('api-webhook-logs', '_doc', result);
      // 2. fetch new item by API and update the content in ES
      const req = `/${group}/${reply.cache.key}`;
      // await this.client.get(req);
      // add the new item right away to the cache
      const article = await this.client.get(req);

      // we parse the item to return minimal data to Elasticsearch
      let parsed = format.filter(article.data.data, addToES);
      // @TODO change property in Cloud CMS to get rid of this.
      parsed.loc ? parsed.loc = {lat: parsed.loc.lat, lon: parsed.loc.long} : false;

      await es.index(parsed);
      // eslint-disable-next-line no-console
      console.log(chalk.cyan('[webhook]'), `- Cache cleared and item reindexed - [${new Date()}]`);
      // return temporary object
      return result;
    }       
    else {
      return this.e(item, 404);
    }
  }

  e (data, type) {
    if(type === 404) throw new errors.NotFound(`The item '${data.title}' was not found in the cache, therefore the new content should be available`);
    if(type === 500) throw new errors.GeneralError('Something happened :(', data);
  }
}

module.exports = new Helpers();