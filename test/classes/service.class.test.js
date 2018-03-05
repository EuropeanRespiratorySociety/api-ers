const chai = require('chai');
const expect = chai.expect;

const app = require('../../src/app');
// const paginate = app.get('paginate');
// const cc = require('../../src/cloudcms');

// Creating the service
const service = app.service('vision');
service.hooks();

describe('Vision service (internal)', function() {

  it('is correctly instantiated', () => {
    expect(service).to.be.an('object');
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });

  it('returns 25 articles/items (internal call)', async () => {
    const r = await service.find();
    expect(r.items).to.be.an('array')
      .to.have.lengthOf.at.least(10);
  }).timeout(4000);

  it('returns service as markdown (internal call)', async () => {
    const r = await service.find({
      query:{
        format: 'markdown'
      }
    });
    expect(r.items).to.be.an('array')
      .to.have.lengthOf.at.least(10);
  }).timeout(4000);

  it('returns raw items (internal call)', async () => {
    const r = await service.find({
      query:{
        format: 'raw'
      }
    });
    expect(r.items).to.be.an('array')
      .to.have.lengthOf.at.least(10);
  }).timeout(4000);

  it('limits the total of service (internal call)', async () => {
    const r = await service.find({
      query:{
        limit: 5
      }
    });
    expect(r.items).to.be.an('array')
      .to.have.lengthOf(5);
  }).timeout(4000);

  it('skip service (internal call)', async () => {
    const r = await service.find({
      query:{
        limit: 5, 
        skip: 5
      }
    });
    expect(r.items).to.be.an('array')
      .to.have.lengthOf(5);
  }).timeout(4000);

  it('sortBy (internal call)', async () => {
    const r = await service.find({
      query:{ 
        sortBy: '_system.created_on.ms'
      }
    });
    expect(r.items).to.be.an('array')
      .to.have.lengthOf.at.least(10);
  }).timeout(4000);
});