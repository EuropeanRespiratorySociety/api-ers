/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const news = this.app.service('news');
    const q = params.query || {};
    const format = q.format || 'html';
    const [mainNews, highlights] = await Promise.all([
      news.find({
        query: { 
          limit: 1,
          filterBy: 'main-news',
          format
        }
      }),
      news.find({
        query: { 
          skip: parseInt(q.skip) || 0,
          limit: parseInt(q.limit) || 4,
          filterBy: 'highlights',
          format
        }
      })
    ]);

    highlights.data.unshift(mainNews.data[0]);

    return highlights;
  }

}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
