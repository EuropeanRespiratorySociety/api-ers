const cc = require('../../src/cloudcms');
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
  /**
   * To run these test we create a new server as we want it
   * to have these test independently. The aim is to test
   * specifically the classe
   * @TODO Imrpove those tests ;)
   */
  before(function(done) {
    if(!this.server) {
      this.timeout(10000);
      cc();
      process.once('Cloud CMS connected', () => {
        this.server = app.listen(3031);
        this.server.on('listening', () => {
          done();
        });
      });
    }
  });

  after(function(done) {
    this.server.close(done);
  });

  it('is correctly instantiated', () => {
    expect(service).to.be.an('object');
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });

  it('returns 25 articles/items (internal call)', async () => {
    const news = await service.find();
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(4000);

  it('returns news as markdown (internal call)', async () => {
    const news = await service.find({query:{format: 'markdown'}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(4000);

  it('returns raw items (internal call)', async () => {
    const news = await service.find({query:{format: 'raw'}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(4000);

  it('limits the total of news (internal call)', async () => {
    const news = await service.find({query:{limit: 5}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(5);
  }).timeout(4000);

  it('skip news (internal call)', async () => {
    const news = await service.find({query:{limit: 5, skip: 5}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(5);
  }).timeout(4000);

  it('sortBy (internal call)', async () => {
    const news = await service.find({query:{sortBy: '_system.created_on.ms'}});
    expect(news.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(4000);
});