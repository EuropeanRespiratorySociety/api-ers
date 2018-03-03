/*eslint no-console: off*/
const chalk = require('chalk');
const m = require('moment');
const errors = require('@feathersjs/errors');
const { promisify } = require('util');
const { Format } = require('ers-utils');
const format = new Format();

const HTTP = require('../../helpers/HTTP');
const es = require('../../helpers/elastic.js');
const client = require('../../helpers/redis');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const addToES = require('./webhook.config').addToES;

class Helpers {
  constructor () {
    this.client = HTTP(process.env.API_URL);
    this.k4 = HTTP('http://k4.ersnet.org/prod/v2/Front/Program');
    this.k4Key = process.env.K4KEY;
    this.k4Params = `?key=${this.k4Key}`; // 5 -> 2015 - 8 -> 2016 - 42 -> 2017 - 90 -> 2018
  }

  async upsertSessions (app, congress, eventId, seeding) {
    const privateMeetings = ['Private meeting', 'Committee meeting'];

    console.log(chalk.cyan('[webhook]'), 'Fetching data...');
    console.time('request');
    const [a, b, c, d, e, f, g, h, i, j, k] = await Promise.all([
      this.k4.get(`/Assemblies${this.k4Params}&e=${eventId}`),
      this.k4.get(`/AssemblyGroups${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Types${this.k4Params}&e=${eventId}`),
      this.k4.get(`/TargetAudiences${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Tracks${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Tags${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Rooms${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Stands${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Institutions${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Faculties${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Sessions${this.k4Params}&e=${eventId}`)
    ]);    
    const requestTime = console.timeEnd('request');

    
    // this.k4.get(`/Conference${this.k4Params}&e=${eventId}`)
    // this.k4.get(`/Event${this.k4Params}&e=${eventId}`)

    const assemblies = a.data;
    const groups = b.data;
    const types = c.data;
    const targets = d.data;
    const tracks = e.data;
    const tags = f.data;
    const rooms = g.data;
    const stands = h.data;
    const institutions = i.data;
    const faculties = j.data;
    const sessions = k.data;

    console.log(chalk.cyan('[webhook]'), `sessions #: ${sessions.length}`);
    console.log(chalk.cyan('[webhook]'), 'Parsing...');
    console.time('parsing');
    const parsedSessions = sessions.map(s => {
      s.year = congress;
      s.k4EventNumber = eventId;
      s.startDateTime = parseDate(s.startDateTime);
      s.endDateTime = parseDate(s.endDateTime);
      s.creationDate = parseDate(s.creationDate);
      s.lastModificationDate = parseDate(s.lastModificationDate);
      s.type = types.filter(o => o.id === s.typeID)[0];
      s.private = privateMeetings.includes(s.type.name);
      s.participants = setProperties(s.participantIDs, faculties, 'guid');
      s.chairs = setProperties(s.chairIDs, faculties, 'guid');
      s.room = rooms.filter(r => r.id === s.roomID);
      s.tags = setProperties(s.tagIDs, tags);
      s.tracks = setProperties(s.trackIDs, tracks);
      s.assemblies = setProperties(s.assemblyIDs, assemblies);
      s.groups = s.assemblygroupIDs.map(i => {
        const gr = groups.filter(o => o.id === i)[0];
        gr.assembly = assemblies.filter(o => o.id === gr.assemblyID)[0];
        return gr;
      });
      s.institutions = congress > 2016  
        ? s.institutionIDs.map(i => {
          let inst = institutions.filter(o => o.id === i)[0];
          inst.exhibitorStand =  stands.filter(o => o.id === inst.exhibitorStandID);
          inst.craStand = stands.filter(o => o.id === inst.craStandID);
          return inst; 
        }) 
        : undefined;
      s.targets = setProperties(s.targetaudienceIDs, targets);
      return s;
    });
    const parsingTime = console.timeEnd('parsing');

    
    const s = app.service('congress/sessions');
    // Seeding database
    if(seeding) {
      const res = await s.Model.insertMany(parsedSessions);
      console.log(chalk.cyan('[webhook]'), 'DB seed status - ', `submitted #: ${parsedSessions.length}, inserted #: ${res.length}`);
      return { message: 'seeded'};
    }

    return await save(s, 'sessions', congress, parsedSessions, requestTime, parsingTime);
  }

  async upsertPresentations (app, congress, eventId, seeding) {
    console.log(chalk.cyan('[webhook]'), 'Fetching data...');
    const faculties = await this.k4.get(`/Faculties${this.k4Params}&e=${eventId}`);
    console.time('request');
    const p = await this.k4.get(`/Presentations${this.k4Params}&e=${eventId}`);
    const requestTime = console.timeEnd('request');
    
    console.log(chalk.cyan('[webhook]'), 'Parsing...');
    console.time('parsing');
    const prezis = p.data.map(p => {
      p.year = congress;
      p.k4EventNumber = eventId;
      p.startDateTime = parseDate(p.startDateTime);
      p.endDateTime = parseDate(p.endDateTime);
      p.creationDate = parseDate(p.creationDate);
      p.lastModificationDate = parseDate(p.lastModificationDate);
      p.AbstractEmbargoDateTime = parseDate(p.AbstractEmbargoDateTime);
      p.speakers = setProperties(p.speakerIDs, faculties.data, 'guid');
      return p;
    });
    const parsingTime = console.timeEnd('parsing');

    const s = app.service('congress/presentations');
    // seeding the database
    if(seeding) {
      const res = await s.Model.insertMany(prezis);
      console.log(chalk.cyan('[webhook]'), 'DB seed status - ', `submitted #: ${prezis.length}, inserted #: ${res.length}`);
      return { message: 'seeded'};
    }

    return await save(s, 'presentations', congress, prezis, requestTime, parsingTime);
  }

  async upsertAbstracts (app, congress, eventId, seeding, force = false) {
    console.log(chalk.cyan('[webhook]'), 'Fetching data...');
    console.time('request');
    const [a, b] = await Promise.all([
      this.k4.get(`/Abstracts${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Authors${this.k4Params}&e=${eventId}`)
    ]);
    const requestTime = console.timeEnd('request');

    console.log(chalk.cyan('[webhook]'), 'Parsing...');
    console.time('parsing');
    const parsedAbstracts = a.data.map(i => {
      i.year = congress;
      i.k4EventNumber = eventId;
      i.authors = setProperties(i.authorIDs, b.data);
      i.AbstractEmbargoDateTime = parseDate(i.AbstractEmbargoDateTime);
      return i;
    });
    const parsingTime = console.timeEnd('parsing');

    const s = app.service('congress/abstracts');
    // seeding the database
    if(seeding) {
      const res = await s.Model.insertMany(parsedAbstracts);
      console.log(chalk.cyan('[webhook]'), 'DB seed status - ', `submitted #: ${parsedAbstracts.length}, inserted #: ${res.length}`);
      return { message: 'seeded'};
    }

    return await save(s, 'abstracts', congress, parsedAbstracts, requestTime, parsingTime, force);
  }

  async upsertJournalAbstract (app, abstract, force = false) {
    console.log(chalk.cyan('[webhook]'), 'Receiving journal abstract...');
    const service = app.service('journals');
    let id;
    let item;
    // arbitrarily set a time in the past that we overwrite if we
    // find a value. This allows the comparison to work and not
    // to check for an error.
    let lastUpdate = m().subtract(10, 'minutes').format();

    if(abstract.doi === '10.1183/09031936.00000309' && abstract.page_url==='http://err.ersjournals.com/content/18/112/125') {
      return { status: 'this item has been arbitriraly discarded as is a DOI duplicate, it should be sorted eventually.' };
    }

    try {
      if(abstract.canonical && abstract.pubmed_id === undefined) {
        item = await service.find({
          query: { canonical: abstract.canonical }
        });
      } else {
        item = await service.find({
          query: {
            pubmed_id: abstract.pubmed_id
          }
        });
      }
      if(item.data.length > 0) {
        id = item.data[0]._id;
      }

      lastUpdate = await getAsync(`journal-abstract-${id}`);
    } catch (e) {
      return {status: 'Error', message: e};
    }

    if (m(item.scrappedOn) > m(lastUpdate) || force) {
      if (id !== undefined) {
        await service.patch(id, abstract, { mongoose: { upsert: true } });
        await setAsync(`journal-abstract-${id}`, m().format());
        return {id: id, status: 'Updated'};
      } else {
        const r = await service.create(abstract);
        id = r._id;
        await setAsync(`journal-abstract-${id}`, m().format());
        return {id: id, status: 'Inserted'};
      }
    }
    return {id: id, status: 'Not updated'};
  }

  async indexErsContent(app, type, printErrors = false) {
    // /feed?full=true&type=ers:article&limit=100
    // use internal service 
    // -- prefix = sessions, presentations, abstracts
    const limit = 100;
    const s = app.service('feed');
    
    // 1. Divide total by batches 
    const data = await s.find({
      query:{ full: true, type, limit }
    });
    const firstBatch = data.data;
    const batches = Math.ceil(data._sys.total / limit);

    // 2. index all batches
    // We already have the data for the first batch
    let result = [];
    console.log(chalk.cyan('[webhook]'), 'Indexing batch #1...');
    console.time('indexing');
    const r1 = await indexErsContentData(firstBatch);
    r1.map(i => result.push({item: i._id, stats: i}));

    let i = 1;
    for(i; i < batches; i++) {
      const b = await s.find({
        query:{ full: true, type, limit, skip: i * limit }
      });

      console.log(chalk.cyan('[webhook]'), `Indexing batch #${i + 1}...`);
      const rn = await indexErsContentData(b.data);
      rn.map(i => result.push({item: i._id, stats: i}));
    }
    console.timeEnd('indexing');
    
    // 3. @TODO record failures and retry
    
    if(printErrors) {
      const errors = result.filter(i => !isSucess(i));
      console.log('Errors: ', errors);
    }

    // 4. preparing some stats and finishing up
    const sucess = result.filter(i => isSucess(i));
    return await logIndexingStats(data._sys.total, 'content', sucess.length);

  }

  async indexJournals(app, printErrors = false) {
    // /feed?full=true&type=ers:article&limit=100
    // use internal service 
    // -- prefix = sessions, presentations, abstracts
    const limit = 100;
    const type = 'journals';
    const s = app.service(type);
    
    // 1. Divide total by batches 
    // there is a lot in this table, lets get only the updated one..
    const lastJob = await getAsync(`last-${type}-indexed-job`);
    const time = lastJob
      ? m(lastJob).format()
      : m().subtract(10, 'minutes').format();

    const data = await s.find({ 
      query: { 
        $limit: limit, 
        updatedAt: {
          $gte: time
        }
      }
    });
    const firstBatch = data.data;
    const batches = Math.ceil(data.total / limit);

    // 2. index all batches
    // We already have the data for the first batch
    let result = [];
    console.log(chalk.cyan('[webhook]'), 'Indexing batch #1...');
    console.time('indexing');
    const r1 = await indexJournalData(firstBatch);
    r1.map(i => result.push({item: i._id.toString(), stats: i}));

    let i = 1;
    for(i; i < batches; i++) {
      const b = await s.find({
        query: {
          $limit: limit, 
          $skip: i * limit, 
          updatedAt: {
            $gte: time
          }
        }
      });

      console.log(chalk.cyan('[webhook]'), `Indexing batch #${i + 1}...`);
      const rn = await indexJournalData(b.data);
      rn.map(i => result.push({item: i._id.toString(), stats: i}));
    }
    console.timeEnd('indexing');
    
    // 3. @TODO record failures and retry
    
    if(printErrors) {
      const errors = result.filter(i => !isSucess(i));
      console.log('Errors: ', errors);
    }

    // 4. preparing some stats and finishing up
    const sucess = result.filter(i => isSucess(i));
    return await logIndexingStats(data.total, type, sucess.length);

  }

  async indexCongress (app, prefix, congress) {
    // use internal service 
    // -- prefix = sessions, presentations, abstracts
    const limit = 100;
    const s = app.service(`congress/${prefix}`);
    // 1. Divide total by batches 
    const data = await s.find({
      query:{ year: congress, $limit: limit }
    });
    const firstBatch = data.data;
    const batches = Math.ceil(data.total / limit);

    // 2. index all batches
    // We already have the data for the first batch
    let result = [];
    console.log(chalk.cyan('[webhook]'), 'Indexing batch #1...');
    console.time('indexing');
    const r1 = await indexCongressData(firstBatch, prefix, congress);
    r1.map(i => result.push({item: i._id, stats: i}));

    let i = 1;
    for(i; i < batches; i++) {
      const b = await s.find({
        query:{ year: congress, $limit: limit, $skip: i * limit }
      });

      console.log(chalk.cyan('[webhook]'), `Indexing batch #${i + 1}...`);
      const rn = await indexCongressData(b.data, prefix, congress);
      rn.map(i => result.push({item: i._id, stats: i}));
    }
    console.timeEnd('indexing');
    
    // 3. @TODO record failures and retry

    // 4. preparing some stats and finishing up
    const sucess = result.filter(i => isSucess(i));
    return await logIndexingStats(data.total, `${prefix}-${congress}`, sucess.length);
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

function setProperties(arrayOfIds, arrayOfValues, id = 'id') {
  return arrayOfIds.map(i => 
    arrayOfValues.filter(o => o[id] === i)[0]
  );
}

async function indexCongressData (array, prefix, congress) {
  try {
    return await Promise.all(array.map(async (item) => {
      // this property is reserved in Elastic Search, 
      // we undefined it as it is more performant than deletein V8 
      item._id = undefined; 
      return await es.index(item, `${prefix}-congress-${congress}`, item.id);
    }));
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function indexErsContentData (array, alias = 'content') {
  try {
    return await Promise.all(array.map(async (item) => {
      const parsed = parse(item);
      return await es.index(parsed, alias, parsed._doc);
    }));
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function indexJournalData (array, alias = 'journals') {
  try {
    return await Promise.all(array.map(async (item) => {
      return await es.index(item, alias, parseJournals(item)._doc);
    }));
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function updateLocalData(service, dataArray, lastUpdate, force = false) {
  console.log(chalk.cyan('[webhook]'), 'Updating Local database...');
  const total = dataArray.length;
  let updated = 0;
  let inserted = 0;
  const operations = await Promise.all(dataArray.map(async (i) =>
  {
    let item;

    try {
      item = await service.get(i.id);
    } catch (e) {
      if(e.code === 404) {
        await service.patch(i.id, i, { mongoose: { upsert: true } });
        inserted++;
        return {id: i.id, status: 'Inserted'};
      }
    }

    if (m(item.lastModificationDate) > m(lastUpdate) || force) {
      await service.patch(i.id, i, { mongoose: { upsert: true } });
      updated++;
      return {id: i.id, status: 'Updated'};
    }
    return {id: i.id, status: 'Not updated'};
  })).catch(e => e);
  return {submitted: total, updated, inserted, updatedItems: operations};
}

async function save(service, type, congress, data, requestTime, parsingTime, force = false) {
  // Saving the Latest Update date to redis
  const lastUpdate = await getAsync(`latest-${type}-update`);
  console.time('saving');
  const result = await updateLocalData(service, data, lastUpdate, force);
  const savingTime = console.timeEnd('saving');
  const now = m().format();
  if(result.updated) await setAsync(`latest-${type}-update`, m().format());
  console.log(chalk.cyan('[webhook]'), `Saved/Updated/Inserted ${type}:
  >>> submitted #: ${result.submitted} 
  >>> updated #: ${result.updated}
  >>> inserted #: ${result.inserted}
  >>> saved On #: ${now}`);

  // Logging Results in Elastic Search
  await es.log('api-webhook-local-data', '_doc', Object.assign({
    type: type,
    year: congress,
    timer: {
      request: requestTime,
      parser: parsingTime,
      saving: savingTime
    },
    savedOn: now
  }, result));
  return result;
}

async function logIndexingStats (total, type, success) {
  const now = m().format();
  console.log(chalk.cyan('[webhook]'), `Saved/Updated/Inserted ${type}:
  >>> type: ${type} 
  >>> local items #: ${total} 
  >>> indexed #: ${success}
  >>> indexed On #: ${now}`);

  await setAsync(`last-${type}-indexed-job`, now);

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

function parseJournals (item) {
  item._doc = item._id.toString();
  item._id = undefined;
  return item;
}

function parse (item) {
  let parsed = format.loadash.pickBy(format.filter(item, addToES), isTrue);
  // @TODO change property in Cloud CMS to get rid of this.
  parsed.loc = hasLocation(parsed)
    ? {lat: parsed.loc.lat, lon: parsed.loc.long} 
    : undefined;
  parsed.hasAuthor = parsed.hasAuthor === 0 ? false : true;
  parsed.hasRelatedArticles = parsed.hasRelatedArticles === 0 ? false : true;
  // tags are not used for now
  parsed.tags = undefined;
  return parsed;
}

function hasLocation (item) {
  return !format.loadash.isEmpty(item.loc) && item.loc.lat;
}

function isTrue (item) {
  return item !== false;
}

function isSucess (item) { 
  return  item.stats.result === 'created' || item.stats.result === 'updated'; 
}