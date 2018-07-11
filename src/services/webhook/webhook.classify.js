const chalk = require('chalk');
const { nlpClient } = require('../../helpers/HTTP');

/*eslint no-console: off*/
class Classifier {
  constructor (options) {
    this.options = options || {};
    this.nlpClient = nlpClient;
  }

  async classifyTrainingData (app) {
    const limit = 1;
    const training = app.service('training-data');
    const feed = app.service('feed');


    console.log(chalk.cyan('[webhook]'), 'Retreiving training data...');
    // 1. Divide total by batches 
    const data = await feed.find({
      query:{ full: true, format: 'raw', type: 'ers:article', contenType: 'all', limit }
    });
    const firstBatch = data.data;
    const batches = Math.ceil(data._sys.total / limit);

    // We already have the data for the first batch
    // let result = [];
    console.log(chalk.cyan('[webhook]'), 'Classifying batch #1...');
    console.time('training');
    const r1 = await this.train(firstBatch, training);
    // r1.map(i => result.push({item: i._id, stats: i}));

    // let i = 1;
    // for(i; i < batches; i++) {
    //   const b = await feed.find({
    //     query:{ full: true, type: 'ers:article', format: 'raw', contenType: 'published', limit, skip: i * limit }
    //   });

    //   console.log(chalk.cyan('[webhook]'), `Classifying batch #${i + 1}...`);
    //   const rn = await this.train(b.data, training);
    //   rn.map(i => result.push({item: i._id, stats: i}));
    // }
    console.timeEnd('training');
    return r1;
  }

  /**
   * training and results saving method
   * @param {*} array - data to classify
   * @param {*} t - training-data service (to save/update results)
   */
  async train (array, t) {
    return array.map(async i => {
      // classify
      const text = `${i.leadParagraph ? i.leadParagraph: ''} ${i.body ? i.body: ''}`.replace(/(\r\n\t|\n|\r\t)/gm, '');
      const r = await this.nlpClient.post('/analyse', { text });
      console.log(chalk.cyan('>>> '), {id: i._doc, status: 'Classified'});

      // save
      const c = {
        text: r.data.text,
        _doc: i._doc,
        source: 'Cloud CMS',
        $addToSet: { classifiers: [
          {
            diseases: r.data.diseases,
            methods: r.data.methods,
            predictions: r.data.predictions,
            version: r.data.version
          }
        ] }
      };

      console.log({text,r, c});
      const result = await t.patch(
        null,
        c,
        { mongoose: { upsert: true }}
      );
      console.log(chalk.cyan('>>> '), {id: i._doc, status: 'Saved'});
      return result;
    });
  }
}

module.exports = new Classifier();