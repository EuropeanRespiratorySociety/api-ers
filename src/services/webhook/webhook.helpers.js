const chalk = require('chalk');
const { promisify } = require('util');
const { Format } = require('ers-utils');
const format = new Format();

const client = require('../../helpers/redis');
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
    this.k4 = HTTP('http://k4.ersnet.org/prod/v2/Front/Program');
    this.k4Key = process.env.K4KEY;
    this.k4Params = `?key=${this.k4Key}&e=42`; // 90 -> 2018
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

      const res = await es.index(parsed);
      // eslint-disable-next-line no-console
      console.log(chalk.cyan('[webhook]'), `- Cache cleared and item reindexed - [${new Date()}]`);
      // return temporary object
      return result;
    }       
    else {
      // temporary, we (try) clean the ers main website cache
      const r = await axios.post(`https://www.ersnet.org/cache?url=${item.url}`);
      // eslint-disable-next-line no-console
      console.log(chalk.cyan('[webhook]'), `- Main website cache: ${r.data} - [${new Date()}]`);
      return this.e(item, 404);
    }
  }

  async indexCongressSessions (congress) {
    const privateMeetings = ['Private meeting', 'Committee meeting'];

    console.log(chalk.cyan('[webhook]'), 'Fetching data...');
    console.time('request');
    const [a, b, c, d, e, f, g, h, i, j, k] = await Promise.all([
      this.k4.get(`/Assemblies${this.k4Params}`),
      this.k4.get(`/AssemblyGroups${this.k4Params}`),
      this.k4.get(`/Types${this.k4Params}`),
      this.k4.get(`/TargetAudiences${this.k4Params}`),
      this.k4.get(`/Tracks${this.k4Params}`),
      this.k4.get(`/Tags${this.k4Params}`),
      this.k4.get(`/Rooms${this.k4Params}`),
      this.k4.get(`/Stands${this.k4Params}`),
      this.k4.get(`/Institutions${this.k4Params}`),
      this.k4.get(`/Faculties${this.k4Params}`),
      this.k4.get(`/Sessions${this.k4Params}`)
    ]);    
    console.timeEnd('request');

    
    // this.k4.get(`//Conference${this.k4Params}`)
    // this.k4.get(`/Event${this.k4Params}`)

    const assemblies = a.data;
    const groups = b.data;
    const types = c.data;
    const target = d.data;
    const tracks = e.data;
    const tags = f.data;
    const rooms = g.data;
    const stands = h.data;
    const institutions = i.data;
    const faculties = j.data;
    const sessions = k.data;


    console.log(chalk.cyan('[webhook]'), 'Parsing...');
    console.time('parsing');
    const parsedSessions = sessions.map(async s => {
      s.startDateTime = parseDate(s.startDateTime);
      s.endDateTime = parseDate(s.endDateTime);
      s.creationDate = parseDate(s.creationDate);
      s.lastModificationDate = parseDate(s.lastModificationDate);
      s.type = types.filter(o => o.id === s.typeID)[0];
      s.private = privateMeetings.includes(s.typeID.name);
      s.participants = s.participantIDs.map(i => faculties.filter(o => o.guid === i)[0]);
      s.chairs = s.chairIDs.map(i => faculties.filter(o => o.guid === i)[0]);
      s.room = rooms.filter(r => r.id === s.roomID);
      s.tags = s.tagIDs.map(i => tags.filter(o => o.id = i)[0]);
      s.tags = s.trackIDs.map(i => tracks.filter(o => o.id = i)[0]);
      s.assemblies = s.assemblyIDs.map(i => assemblies.filter(o => o.id === i)[0]);
      s.groups = s.assemblygroupIDs.map(i => {
        const gr = groups.filter(o => o.id === i)[0];
        gr.assembly = assemblies.filter(o => o.id === gr.assemblyID)[0];
        return gr;
      });
      s.institutions = s.institutionIDs.map(i => {
        let inst = institutions.filter(o => o.id === i)[0];
        inst.exhibitorStand = stands.filter(o => o.id === inst.exhibitorStandID);
        inst.craStand = stands.filter(o => o.id === inst.craStandID);
        return inst; 
      });
      s.targets = s.targetaudienceIDs.map(i => target.filter(o => o.id === i)[0]);
      return s;
    });
    console.timeEnd('parsing');

    console.log(chalk.cyan('[webhook]'), 'Indexing...');
    console.time('indexing');
    const result = await Promise.all(parsedSessions.map(async i => await es.index(i, `sessions-${congress}`, i.id)));
    console.timeEnd('indexing');

    console.log(chalk.cyan('[webhook]'), 'Sessions #: ', result.length);
    return result;
  }

  async indexCongressPresentations (congress) {
    console.log(chalk.cyan('[webhook]'), 'Fetching data...');
    const faculties = await this.k4.get(`/Faculties${this.k4Params}`);
    console.time('request');
    const p = await this.k4.get(`/Presentations${this.k4Params}`);
    console.timeEnd('request');
    
    console.log('Parsing...');
    console.time('parsing');
    const prezis = p.data.map(p => {
      p.startDateTime = parseDate(p.startDateTime);
      p.endDateTime = parseDate(p.endDateTime);
      p.creationDate = parseDate(p.creationDate);
      p.lastModificationDate = parseDate(p.lastModificationDate);
      p.AbstractEmbargoDateTime = parseDate(p.AbstractEmbargoDateTime);
      p.speakers = p.speakerIDs.map(s => faculties.data.filter(o => o.guid == s)[0]);
      return p;
    });
    console.timeEnd('parsing');

    console.log(chalk.cyan('[webhook]'), 'Indexing...');
    console.time('indexing');
    const result = await Promise.all(prezis.map(async i => await es.index(i, `presentations-${congress}`, i.id)));
    console.timeEnd('indexing');

    console.log(chalk.cyan('[webhook]'), 'Presentations #: ', result.length);
    return result;
  }

  async indexCongressAbstracts (congress) {
    console.log(chalk.cyan('[webhook]'), 'Fetching data...');
    console.time('request');
    const [a, b] = await Promise.all([
      this.k4.get(`/Abstracts${this.k4Params}`),
      this.k4.get(`/Authors${this.k4Params}`)
    ]);
    console.timeEnd('request');

    console.log(chalk.cyan('[webhook]'), 'Parsing...');
    console.time('parsing');
    const parsedAbstracts = a.data.map(i => {
      i.authors = i.authorIDs.map(absId => b.data.filter(ath => ath.id === absId)[0]);
      i.AbstractEmbargoDateTime = parseDate(i.AbstractEmbargoDateTime);
      return i;
    });
    console.timeEnd('parsing');

    console.log(chalk.cyan('[webhook]'), 'Indexing...');
    console.time('indexing');
    const result = await Promise.all(parsedAbstracts.map(async i => await es.index(i, `abstracts-${congress}`, i.id)));
    console.timeEnd('indexing');

    console.log(chalk.cyan('[webhook]'), 'Abstracts #: ', result.length);
    return result;
  }

  e (data, type) {
    if(type === 404) throw new errors.NotFound(`The item '${data.title}' was not found in the cache, therefore the new content should be available`);
    if(type === 500) throw new errors.GeneralError('Something happened :(', data);
  }
}

module.exports = new Helpers();

function parseDate(date) {
  return date !== null ? m(date).format() : null;
}