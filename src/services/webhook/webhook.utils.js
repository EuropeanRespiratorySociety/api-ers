/*eslint no-console: off*/
const { Format } = require('ers-utils');
const { promisify } = require('util');
const m = require('moment');
const chalk = require('chalk');
const format = new Format();

const redis = require('../../helpers/redis');
const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);

const addToES = require('./webhook.config').addToES;
const es = require('../../helpers/elastic.js');

class Utils {

  constructor () {
    this.getAsync = getAsync;
    this.setAsync = setAsync;

  }

  setDocProperty (item) {
    item._doc = item._id.toString();
    item._id = undefined;
    item.references = item.references ? item.references.map(i => {
      if (i.links !== undefined && typeof i.links === 'string') {
        i.links = [];
      }
      return i;
    }) : [];
    return item;
  }

  setProperties(arrayOfIds, arrayOfValues, id = 'id') {
    return arrayOfIds.map(i => 
      arrayOfValues.filter(o => o[id] === i)[0]
    );
  }

  parse (item) {
    let parsed = format.lodash.pickBy(format.filter(item, addToES), this.isTrue);
    // @TODO change property in Cloud CMS to get rid of this.
    parsed.loc = this.hasLocation(parsed)
      ? { lat: parsed.loc.lat, lon: parsed.loc.long } 
      : undefined;
    if(parsed.registerButton) {
      parsed.registerButton = this.setRegisterButton(parsed);
    }
    parsed.hasAuthor = parsed.hasAuthor === 0 ? false : true;
    parsed.hasRelatedArticles = parsed.hasRelatedArticles === 0 ? false : true;
    // tags are not used for now
    parsed.tags = undefined;
    return parsed;
  }

  parseDate (date) {
    return date !== null ? m(date).format() : null;
  }

  hasLocation (item) {
    return !format.lodash.isEmpty(item.loc) && 'lat' in item.loc;
  }

  setRegisterButton (item) {
    const obj = item.registerButton;

    /* eslint-disable */
    return obj.link && !obj.text
      ? { link: obj.link }
      : obj.link && obj.text
      ? obj
      : undefined;
    /* eslint-enable */
  }

  isTrue (item) {
    return item !== false;
  }

  isSucess (item) { 
    return  item.stats.result === 'created' || item.stats.result === 'updated'; 
  }

  async indexData (array, alias = 'content') {
    try {
      return await Promise.all(array.map(async (item) => {
        const parsed = alias === 'journals'
          ? this.setDocProperty(item)
          : this.parse(item);
        return await es.index(parsed, alias, parsed._doc);
      }));
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async logIndexingStats (total, type, success) {
    const now = m().format();
    console.log(chalk.cyan('[webhook]'), `Saved/Updated/Inserted ${type}:
    >>> type: ${type} 
    >>> local items #: ${total} 
    >>> indexed #: ${success}
    >>> indexed On #: ${now}`);
  
    await this.setAsync(`last-${type}-indexed-job`, now);
  
    const stats = {
      localItems: total,
      indexingType: type,
      indexingSuccess: success,
      indexedOn: now
    };
  
    try {
      await es.log('api-webhook-indexing-logs', '_doc', stats);
      return stats;
    } catch (e) {
      return e;
    }
  }
}

module.exports = new Utils();