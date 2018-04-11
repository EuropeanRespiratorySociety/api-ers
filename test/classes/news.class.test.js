const chai = require('chai');
const expect = chai.expect;

const app = require('../../src/app');
const paginate = app.get('paginate');
// const cc = require('../../src/cloudcms');

// Creating the service
const createService = require('../../src/services/news/news.class');
app.use('/news', createService({paginate}));
const service = app.service('news');


describe('News Class', function() {

  it('is correctly instantiated', () => {
    expect(service).to.be.an('object');
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });

  it('returns 25 articles/items (internal call)', async () => {
    const news = await service.find();
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(10000);

  it('returns news as markdown (internal call)', async () => {
    const news = await service.find({query:{format: 'markdown'}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(10000);

  it('returns raw items (internal call)', async () => {
    const news = await service.find({query:{format: 'raw'}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(10000);

  it('limits the total of news (internal call)', async () => {
    const news = await service.find({query:{limit: 5}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(5);
  }).timeout(10000);

  it('skip news (internal call)', async () => {
    const news = await service.find({query:{limit: 5, skip: 5}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(5);
  }).timeout(10000);

  it('sortBy (internal call)', async () => {
    const news = await service.find({query:{sortBy: '_system.created_on.ms'}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(10000);
});