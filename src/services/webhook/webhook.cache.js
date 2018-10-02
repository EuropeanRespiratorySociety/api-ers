/*eslint no-console: off*/
// @TODO: remove - we need this one temporarily while we bust the ERS Website
const axios = require('axios');
const chalk = require('chalk');
const m = require('moment');

const { HTTP } = require('../../helpers/HTTP');
const es = require('../../helpers/elastic.js');

const errors = require('@feathersjs/errors');

const u = require('./webhook.utils');


class Cache {
  constructor() {
    this.client = HTTP(process.env.API_URL);
  }

  async clear(data) {
    const item = data._cloudcms.node.object;

    // special case for events
    if (item.hasOwnProperty('category')) {
      clearCalendar(this.client, item);
      clearNews(this.client, item);
    }

    if (item.hasOwnProperty('category2')) {
      item.category2.map(i => {
        clearCalendar(this.client, i);
        clearNews(this.client, i);
      });
    }

    // Getting the item from the cache (Redis)
    const reply = JSON.parse(await u.getAsync(item.slug));
    // clear a single item and its parent
    if (reply) {
      singleItem(this.client, item, reply, false, true);
    } else {
      // temporary, we (try to) clean the ers main website cache
      const r = await axios.post(`https://www.ersnet.org/cache?url=${item.url}`);
      // eslint-disable-next-line no-console
      console.log(chalk.cyan('[webhook]'), `- Main website cache: ${r.data} - [${new Date()}]`);
      return this.e(item, 404);
    }
  }

  e(data, type) {
    if (type === 404) throw new errors.NotFound(`The item '${data.title}' was not found in the cache, therefore the new content should be available`);
    if (type === 500) throw new errors.GeneralError('Something happened :(', data);
  }
}

module.exports = new Cache();

async function singleItem(client, item, reply, category = false, index = false) {
  const [head, ...tail] = reply.cache.group.split('-'); // eslint-disable-line
  const group = tail.join('-');
  // temporary, we (try to) clean the ers main website cache
  const a = axios.post(`https://www.ersnet.org/cache?url=${reply.data.url}`);
  // the cache is not always busted: @TODO fix it! issue #24 
  const b = client.get(`/cache/clear/single/${reply.cache.key}`);
  const c = client.get(`/cache/clear/group/${group}`);
  const [ta, tb, tc] = await Promise.all([a, b, c]);

  const result = {
    timestamp: m().format('x'),
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
  const req = !category
    ? `/${group}/${reply.cache.key}`
    : `/${group}`;

  // await client.get(req);
  // add the new item right away to the cache
  const article = await client.get(req);


  // we parse the item to return minimal data to Elasticsearch
  const parsed = u.parse(article.data.data);

  if (index) {
    item.unpublished
      ? await es.unIndex(item)
      : await es.index(parsed, 'content', parsed._doc);
  }

  // eslint-disable-next-line no-console
  console.log(chalk.cyan('[webhook]'), `- Cache cleared ${index && !item.unpublished ? 'and item reindexed ' : index && !item.unpublished ? 'and item removed from index' : ''}- [${new Date()}]`);
  // return temporary object
  return result;
}

// This is temporary until we change the website
const urlToBust = [
  'https://www.ersnet.org'
];

const calendarUrlToBust = [
  'https://www.ersnet.org/congress-and-events/events-calendar?type=deadline',
  'https://www.ersnet.org/congress-and-events/events-calendar?type=endorsed',
  'https://www.ersnet.org/congress-and-events/events-calendar?type=non-ers',
  'https://www.ersnet.org/congress-and-events/events-calendar?type=all'
];

function clearCalendar(client, item) {
  if (item.category && item.category.title === 'Events Calendar') {
    const data = {
      cache: {
        key: 'calendar',
        group: 'group-calendar'
      },
      data: {
        url: 'https://www.ersnet.org/congress-and-events/events-calendar'
      }
    };
    singleItem(client, item, data, true);
    axios.post(`https://www.ersnet.org/cache?url=${urlToBust[0]}`);
    axios.post(`https://www.ersnet.org/cache?url=${calendarUrlToBust[0]}`);
    axios.post(`https://www.ersnet.org/cache?url=${calendarUrlToBust[1]}`);
    axios.post(`https://www.ersnet.org/cache?url=${calendarUrlToBust[2]}`);
    axios.post(`https://www.ersnet.org/cache?url=${calendarUrlToBust[3]}`);
  }
}

function clearNews(client, item) {
  if (item.category && item.category.title === 'News and Features') {
    const data = {
      cache: {
        key: 'news',
        group: 'group-news'
      },
      data: {
        url: 'https://www.ersnet.org/the-society/news'
      }
    };
    singleItem(client, item, data, true);
    // let's clear other urls while thinking about it:
    axios.post(`https://www.ersnet.org/cache?url=${urlToBust[0]}`);
  }
  // app-highlights
  if (item.category && item.category.qname === 'o:ec586ddd9c918191be2b') {
    const appData = {
      cache: {
        key: item.slug,
        group: 'group-app-highlights'
      },
      data: {
        url: 'https://www.ersnet.org/the-society/news'
      }
    };
    singleItem(client, item, appData, true);
    // let's clear other urls while thinking about it:
    axios.post(`https://www.ersnet.org/cache?url=${urlToBust[0]}`);
  }
}