const chalk = require('chalk');
const { nlpClient } = require('../../helpers/HTTP');
const sureThing = require('../../helpers/sureThing');
const { Format } = require('ers-utils');
const f = new Format();

/*eslint no-console: off*/
class Classifier {
  constructor(options) {
    this.options = options || {};
    this.nlpClient = nlpClient;
  }

  async classifyCloudCMSContent(app) {
    const limit = 30;
    const training = app.service('training-data');
    const feed = app.service('feed');


    console.log(chalk.cyan('[webhook]'), 'Retreiving training data...');
    // 1. Divide total by batches 
    const data = await feed.find({
      query: { full: true, type: 'ers:article', contentType: 'all', limit }
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
    for (i; i < batches; i++) {
      const b = await feed.find({
        query: { full: true, type: 'ers:article', contentType: 'all', limit, skip: i * limit }
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
  async trainOnCloudCMSData(array, t) {
    return await Promise.all(array.map(async (i) => {
      const originalText = `${i.leadParagraph ? i.leadParagraph : ''} ${i.body ? i.body : ''}`;
      const text = cleanHtml(originalText);

      if (i.leadParagraph || i.body) {
        const { ok, response, error } = await sureThing(this.nlpClient.post('/analyse', { text }));
        // console.log(chalk.cyan('>>> '), {id: i._doc, status: ok ? 'Classified' : 'Something went wrong', error});

        const categories = [];
        i.category.title ? categories.push({ id: i.category.id, title: i.category.title }) : undefined;
        i.category2.length > 0 && i.category2[0].title ? i.category2.forEach(d => {
          categories.push({ id: d.id, title: d.title });
        }) : undefined;

        // save
        const c = {
          originalText,
          text: response.data.text,
          title: i.title,
          _doc: i._doc,
          source: 'Cloud CMS',
          categories,
          slug: i.slug,
          $addToSet: {
            classifiers:
            {
              diseases: response.data.diseases,
              methods: response.data.methods === 'coming soon' ? undefined : response.data.methods,
              predictions: response.data.predictions,
              version: response.data.version
            }
          }
        };

        const result = await sureThing(t.patch(
          null,
          c,
          {
            query: { _doc: i._doc },
            mongoose: { upsert: true }
          }
        ));
        console.log(chalk.cyan('>>> '), { id: i._doc, status: result.ok ? 'Saved' : 'Error', error });
        return { id: i._doc, classification: ok, status: result.ok ? 'Saved' : 'Error' };
      }
      console.log(chalk.cyan('>>> '), { id: i._doc, message: 'Item not classified - no useful text' });
      return { id: i._doc, message: 'Item not classified - no useful text' };
    }));
  }

  async classifyJournals(app) {
    const limit = 30;
    const training = app.service('training-data');
    const s = app.service('journals');


    console.log(chalk.cyan('[webhook]'), 'Retreiving training data...');
    // 1. Divide total by batches 
    const data = await s.find({
      query: { $limit: limit }
    });
    const firstBatch = data.data;
    const batches = Math.ceil(data.total / limit);
    console.log(chalk.cyan('[webhook]'), `${data.total} to classify in ${batches} batches`);

    // We already have the data for the first batch
    let result = [];
    console.log(chalk.cyan('[webhook]'), 'Classifying batch #1...');
    console.time('training');
    const r1 = await this.trainOnJournalAbstracts(firstBatch, training);
    // @TODO if necessary, we could train the full text
    r1.map(i => result.push(i));

    let i = 1;
    for (i; i < batches; i++) {
      console.log({ i, limit, $skip: i * limit })
      const b = await s.find({
        query: { $limit: limit, $skip: i * limit }
      });

      console.log(chalk.cyan('[webhook]'), `Classifying batch #${i + 1}...`);
      const rn = await this.trainOnJournalAbstracts(b.data, training);
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
  async trainOnJournalAbstracts(array, t) {
    return await Promise.all(array.map(async (i) => {
      if (i.abstract && i.abstract.length > 10) {
        const text = cleanHtml(i.abstract);
        const { ok, response, error } = await sureThing(this.nlpClient.post('/analyse', { text }));
        // save
        if (ok) {
          const c = {
            originalText: i.abstract,
            text: response.data.text,
            title: i.title,
            _journal: i._id,
            source: 'Journals',
            $addToSet: {
              classifiers:
              {
                diseases: response.data.diseases,
                methods: response.data.methods === 'coming soon' ? undefined : response.data.methods,
                predictions: response.data.predictions,
                version: response.data.version
              }
            }
          };

          const result = await sureThing(t.patch(
            null,
            c,
            {
              query: { _journal: i._id },
              mongoose: { upsert: true }
            }
          ));

          console.log(chalk.cyan('>>> '), { id: i._id, status: result.ok ? 'Saved' : 'Error', error });
          return { id: i._id, classification: ok, status: result.ok ? 'Saved' : 'Error' };
        }

        console.log(chalk.cyan('>>> '), { id: i._id, status: 'Error', error });
        return { id: i._id, classification: ok, status: 'Error', error };

      }
      console.log(chalk.cyan('>>> '), { id: i._id, message: 'Item not classified - no useful text' });
      return { id: i._id, message: 'Item not classified - no useful text' };
    }));
  }
}

module.exports = new Classifier();

function cleanHtml(text) {
  return f.clean(text).replace(/(\r\n\t|\n|\r\t)/gm, ' ');
}