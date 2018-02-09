const client = require('../../helpers/redis');
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);

const m = require('moment');
const es = require('../../helpers/elastic.js');

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
      await es.log('api-webhook-logs', 'cache', result);
      // 2. fetch new item by API and update the content in ES
      const req = `/${group}/${reply.cache.key}`;
      const article = await this.client.get(req);
      await es.index(article.data.data);
      // this will thus add right away the new item in the cache
      
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