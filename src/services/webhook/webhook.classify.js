const chalk = require('chalk');
const { nlpClient } = require('../../helpers/HTTP');

/*eslint no-console: off*/
class Classifier {
  async classifyTrainingData (app) {
    const limit = 100;
    const training = app.service('training-data');
    const feed = app.service('feed');


    console.log(chalk.cyan('[webhook]'), 'Classifying training data...');
    // 1. Divide total by batches 
    const data = await feed.find({
      query:{ full: true, type: 'ers:article', contenType: 'all', limit }
    });
    const firstBatch = data.data;
    const batches = Math.ceil(data._sys.total / limit);

    // We already have the data for the first batch
    let result = [];
    console.log(chalk.cyan('[webhook]'), 'Classifying batch #1...');
    console.time('indexing');
    const r1 = await indexData(firstBatch);
    r1.map(i => result.push({item: i._id, stats: i}));

    let i = 1;
    for(i; i < batches; i++) {
      const b = await feed.find({
        query:{ full: true, type: 'ers:article', contenType: 'published', limit, skip: i * limit }
      });

      console.log(chalk.cyan('[webhook]'), `Indexing batch #${i + 1}...`);
      const rn = await indexData(b.data);
      rn.map(i => result.push({item: i._id, stats: i}));
    }
    console.timeEnd('indexing');

  }
}

module.exports = new Classifier();