const chalk = require('chalk');
const { nlpClient } = require('../../helpers/HTTP');
const sureThing = require('../../helpers/sureThing');

/*eslint no-console: off*/
class Classifier {
  constructor (options) {
    this.options = options || {};
    this.nlpClient = nlpClient;
  }

  async classifyCloudCMSContent (app) {
    const limit = 30;
    const training = app.service('training-data');
    const feed = app.service('feed');


    console.log(chalk.cyan('[webhook]'), 'Retreiving training data...');
    // 1. Divide total by batches 
    const data = await feed.find({
      query:{ full: true, format: 'raw', type: 'ers:article', contentType: 'all', limit}
    });
    const firstBatch = data.data;
    const batches = Math.ceil(data._sys.total / limit);
    console.log(chalk.cyan('[webhook]'), `${data._sys.total} to classify in ${batches} batches`);

    // We already have the data for the first batch
    let result = [];
    console.log(chalk.cyan('[webhook]'), 'Classifying batch #1...');
    console.time('training');
    const r1 = await this.trainOnCloudCMSData(firstBatch, training);
    r1.map(i => result.push(i));

    let i = 1;
    for(i; i < batches; i++) {
      const b = await feed.find({
        query:{ full: true, type: 'ers:article', format: 'raw', contentType: 'all', limit, skip: i * limit}
      });

      console.log(chalk.cyan('[webhook]'), `Classifying batch #${i + 1}...`);
      const rn = await this.trainOnCloudCMSData(b.data, training);
      rn.map(i => result.push(i));
    }

    console.timeEnd('training');
    return result;
  }

  /**
   * training and results saving method
   * @param {*} array - data to classify
   * @param {*} t - training-data service (to save/update results)
   */
  async trainOnCloudCMSData (array, t) {
    return await Promise.all(array.map(async (i) => {
      // classify
      const text = `${i.leadParagraph ? i.leadParagraph: ''} ${i.body ? i.body: ''}`.replace(/(\r\n\t|\n|\r\t)/gm, ' ');

      const { ok, response, error } = await sureThing(this.nlpClient.post('/analyse', { text }));
      // console.log(chalk.cyan('>>> '), {id: i._doc, status: ok ? 'Classified' : 'Something went wrong', error});

      const category = [];
      i.category.title ? category.push({ id: i.category.id, title: i.category.title}) : undefined;
      i.category2.length > 0 && i.category2[0].title ? i.category2.forEach(d => {
        category.push({ id: d.category.id, title: d.category.title });
      }) : undefined;

      // save
      const c = {
        text: response.data.text,
        _doc: i._doc,
        source: 'Cloud CMS',
        category,
        $addToSet: { classifiers: 
          {
            diseases: response.data.diseases,
            methods: response.data.methods === 'coming soon' ? undefined : response.data.methods,
            predictions: response.data.predictions,
            version: response.data.version
          }
        }
      };

      console.log('category:', c.category);

      const result = await sureThing(t.patch(
        null,
        c,
        {
          query: { _doc: i._doc },
          mongoose: { upsert: true }
        }
      ));
      console.log(chalk.cyan('>>> '), {id: i._doc, status: result.ok ? 'Saved' : 'Error', error});
      return {id: i._doc, classification: ok, status: result.ok ? 'Saved' : 'Error'};
    }));
  }
}

module.exports = new Classifier();