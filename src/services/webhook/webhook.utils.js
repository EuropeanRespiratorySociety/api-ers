const { Format } = require('ers-utils');
const { promisify } = require('util');
const m = require('moment');
const format = new Format();

const redis = require('../../helpers/redis');
const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);

const addToES = require('./webhook.config').addToES;

class Utils {

  constructor () {
    this.getAsync = getAsync;
    this.setAsync = setAsync;

  }

  setDocProperty (item) {
    item._doc = item._id.toString();
    item._id = undefined;
    return item;
  }

  setProperties(arrayOfIds, arrayOfValues, id = 'id') {
    return arrayOfIds.map(i => 
      arrayOfValues.filter(o => o[id] === i)[0]
    );
  }

  parse (item) {
    let parsed = format.loadash.pickBy(format.filter(item, addToES), this.isTrue);
    // @TODO change property in Cloud CMS to get rid of this.
    parsed.loc = this.hasLocation(parsed)
      ? { lat: parsed.loc.lat, lon: parsed.loc.long } 
      : undefined;
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
    return !format.loadash.isEmpty(item.loc) && 'lat' in item.loc;
  }

  isTrue (item) {
    return item !== false;
  }

  isSucess (item) { 
    return  item.stats.result === 'created' || item.stats.result === 'updated'; 
  }
}

module.exports = new Utils();