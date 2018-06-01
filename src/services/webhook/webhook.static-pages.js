/*eslint no-console: off*/
const chalk = require('chalk');
const p = require('./static-to-index/pages');
const es = require('../../helpers/elastic.js');

class StaticPages {

  async index () {
    console.log(chalk.cyan('[webhook]'), 'indexing static pages...');
    try {
      return await Promise.all(p.map(async (item) => {
        console.log(chalk.cyan('>>> '), item.title);
        return await es.index(item, 'content', item.slug);
      }));
    } catch (e) {
      console.log(e);
      return e;
    }
  }

}

module.exports = new StaticPages();