/*eslint no-console: off*/
const chalk = require('chalk');
const m = require('moment');

const { HTTP, k4Client } = require('../../helpers/HTTP');
const es = require('../../helpers/elastic.js');

const u = require('./webhook.utils');
const sanitizeHtml = require('sanitize-html');
const clean = (string) => {
  return sanitizeHtml(string, {
    allowedTags: [],
    allowedAttributes: []
  });
};

class Helpers {
  constructor () {
    this.client = HTTP(process.env.API_URL);
    this.k4 = k4Client;
    this.k4Key = process.env.K4KEY;
    this.k4Params = `?key=${this.k4Key}`; // 5 -> 2015 - 8 -> 2016 - 42 -> 2017 - 90 -> 2018
  }

  async upsertSessions (app, congress, eventId, seeding) {
    const privateMeetings = ['Private meeting', 'Committee meeting'];

    console.log(chalk.cyan('[webhook]'), 'Fetching data...');
    console.time('request');
    const [a, b, c, d, e, f, g, h, i, j, k] = await Promise.all([
      this.k4.get(`/Program/Assemblies${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/AssemblyGroups${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Types${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/TargetAudiences${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Tracks${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Tags${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Rooms${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Stands${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Institutions${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Faculties${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Sessions${this.k4Params}&e=${eventId}`)
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
      s.startDateTime = u.parseDate(s.startDateTime);
      s.endDateTime = u.parseDate(s.endDateTime);
      s.creationDate = u.parseDate(s.creationDate);
      s.lastModificationDate = u.parseDate(s.lastModificationDate);
      s.type = types.filter(o => o.id === s.typeID)[0];
      s.private = privateMeetings.includes(s.type.name);
      s.participants = u.setProperties(s.participantIDs, faculties, 'guid');
      s.chairs = u.setProperties(s.chairIDs, faculties, 'guid');
      s.room = rooms.filter(r => r.id === s.roomID);
      s.tags = u.setProperties(s.tagIDs, tags);
      s.tracks = u.setProperties(s.trackIDs, tracks);
      s.assemblies = u.setProperties(s.assemblyIDs, assemblies);
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
      s.targets = u.setProperties(s.targetaudienceIDs, targets);
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
    const faculties = await this.k4.get(`/Program/Faculties${this.k4Params}&e=${eventId}`);
    console.time('request');
    const p = await this.k4.get(`/Program/Presentations${this.k4Params}&e=${eventId}`);
    const requestTime = console.timeEnd('request');
    
    console.log(chalk.cyan('[webhook]'), 'Parsing...');
    console.time('parsing');
    const prezis = p.data.map(p => {
      p.year = congress;
      p.k4EventNumber = eventId;
      p.startDateTime = u.parseDate(p.startDateTime);
      p.endDateTime = u.parseDate(p.endDateTime);
      p.creationDate = u.parseDate(p.creationDate);
      p.lastModificationDate = u.parseDate(p.lastModificationDate);
      p.AbstractEmbargoDateTime = u.parseDate(p.AbstractEmbargoDateTime);
      p.speakers = u.setProperties(p.speakerIDs, faculties.data, 'guid');
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
      this.k4.get(`/Program/Abstracts${this.k4Params}&e=${eventId}`),
      this.k4.get(`/Program/Authors${this.k4Params}&e=${eventId}`)
    ]);
    const requestTime = console.timeEnd('request');

    console.log(chalk.cyan('[webhook]'), 'Parsing...');
    console.time('parsing');
    const parsedAbstracts = a.data.map(i => {
      i.year = congress;
      i.k4EventNumber = eventId;
      i.authors = u.setProperties(i.authorIDs, b.data);
      i.abstractTextOriginal = i.abstractText;
      i.abstractText = clean(i.abstractText).replace(/(\r\n\t|\n|\r\t)/gm,'');
      i.AbstractEmbargoDateTime = u.parseDate(i.AbstractEmbargoDateTime);
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
    const r1 = await indexData(firstBatch);
    r1.map(i => result.push({item: i._id, stats: i}));

    let i = 1;
    for(i; i < batches; i++) {
      const b = await s.find({
        query:{ full: true, type, limit, skip: i * limit }
      });

      console.log(chalk.cyan('[webhook]'), `Indexing batch #${i + 1}...`);
      const rn = await indexData(b.data);
      rn.map(i => result.push({item: i._id, stats: i}));
    }
    console.timeEnd('indexing');
    
    // 3. @TODO record failures and retry
    
    if(printErrors) {
      const errors = result.filter(i => !u.isSucess(i));
      console.log('Errors: ', errors);
    }

    // 4. preparing some stats and finishing up
    const sucess = result.filter(i => u.isSucess(i));
    return await logIndexingStats(data._sys.total, 'content', sucess.length);

  }

  async indexCongress (app, prefix, congress) {
    // use internal service 
    // -- prefix = sessions, presentations, abstracts
    const limit = 100;
    const s = app.service(`congress/${prefix}`);
    const query = prefix === 'sessions' ? { year: congress, private: false, $limit: limit } : { year: congress, $limit: limit };
    // 1. Divide total by batches 
    const data = await s.find({
      query
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
        query: Object.assign({}, query, { $skip: i * limit })
      });

      console.log(chalk.cyan('[webhook]'), `Indexing batch #${i + 1}...`);
      const rn = await indexCongressData(b.data, prefix, congress);
      rn.map(i => result.push({item: i._id, stats: i}));
    }
    console.timeEnd('indexing');
    
    // 3. @TODO record failures and retry

    // 4. preparing some stats and finishing up
    const sucess = result.filter(i => u.isSucess(i));
    return await logIndexingStats(data.total, `${prefix}-${congress}`, sucess.length);
  }
}

module.exports = new Helpers();

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

async function indexData (array, alias = 'content') {
  try {
    return await Promise.all(array.map(async (item) => {
      const parsed = alias === 'journals'
        ? u.setDocProperty(item)
        : u.parse(item);
      return await es.index(parsed, alias, parsed._doc);
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
  const lastUpdate = await u.getAsync(`latest-${type}-update`);
  console.time('saving');
  const result = await updateLocalData(service, data, lastUpdate, force);
  const savingTime = console.timeEnd('saving');
  const now = m().format();
  if(result.updated) await u.setAsync(`latest-${type}-update`, m().format());
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

  await u.setAsync(`last-${type}-indexed-job`, now);

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