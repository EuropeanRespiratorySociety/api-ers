/*eslint no-console: off*/
const chalk = require('chalk');
const m = require('moment');
const u = require('./webhook.utils');

class Journals {

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
          query: { 
            canonical: abstract.canonical
          }
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

      lastUpdate = await u.getAsync(`journal-abstract-${id}`);
    } catch (e) {
      return {status: 'Error', message: e};
    }

    if (m(item.scrappedOn) > m(lastUpdate) || force) {
      if (id !== undefined) {
        await service.patch(id, abstract, { mongoose: { upsert: true } });
        await u.setAsync(`journal-abstract-${id}`, m().format());
        console.log(chalk.cyan('>>> '), {id: id, status: 'Updated'});
        return {id: id, status: 'Updated'};
      } else {
        const r = await service.create(abstract);
        id = r._id;
        await u.setAsync(`journal-abstract-${id}`, m().format());
        console.log(chalk.cyan('>>> '), {id: id, status: 'Inserted'});
        return {id: id, status: 'Inserted'};
      }
    }
    console.log(chalk.cyan('>>> '), {id: id, status: 'Not updated'});
    return {id: id, status: 'Not updated'};
  }

  async indexJournals(app, printErrors = false, force = false) {
    // /feed?full=true&type=ers:article&limit=100
    // use internal service 
    // -- prefix = sessions, presentations, abstracts
    const limit = 100;
    const type = 'journals';
    const s = app.service(type);
    
    // 1. Divide total by batches 
    // there is a lot in this table, lets get only the updated one..
    const lastJob = await u.getAsync(`last-${type}-indexed-job`);
    const time = lastJob
      ? m(lastJob).format()
      : m().subtract(10, 'minutes').format();

    const data = await s.find({ 
      query: Object.assign(
        {}, 
        { 
          $limit: limit,
          article_type: {
            $ne: ''
          }
        }, 
        force ? {} : { updatedAt: { $gte: time }}
      )
    });
    const firstBatch = data.data;
    const batches = Math.ceil(data.total / limit);

    // 2. index all batches
    // We already have the data for the first batch
    let result = [];
    console.log(chalk.cyan('[webhook]'), 'Indexing batch #1...');
    console.time('indexing');
    const r1 = await u.indexData(firstBatch, 'journals');
    r1.map(i => { 
      console.log(i);
      result.push({item: i._id.toString(), stats: i});
    });

    let i = 1;
    for(i; i < batches; i++) {
      const b = await s.find({
        query: Object.assign(
          {}, 
          { 
            $limit: limit, $skip: i * limit,
            article_type: {
              $ne: ''
            }
          }, 
          force ? {} : { updatedAt: { $gte: time }}
        )
      });

      console.log(chalk.cyan('[webhook]'), `Indexing batch #${i + 1}...`);
      const rn = await u.indexData(b.data, 'journals');
      rn.map(i => result.push({item: i._id.toString(), stats: i}));
    }
    console.timeEnd('indexing');
    
    // 3. @TODO record failures and retry
    
    if(printErrors) {
      const errors = result.filter(i => !u.isSucess(i));
      console.log('Errors: ', errors);
    }

    // 4. preparing some stats and finishing up
    const sucess = result.filter(i => u.isSucess(i));
    return await u.logIndexingStats(data.total, type, sucess.length);

  }

}

module.exports = new Journals();