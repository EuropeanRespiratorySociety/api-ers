const chai = require('chai');
const expect = chai.expect;

const app = require('../../src/app');
const paginate = app.get('paginate');
// const cc = require('../../src/cloudcms');

// Creating the service
const createService = require('../../src/services/relatives/relatives.class');
app.use('/relatives', createService({paginate}));
const service = app.service('relatives');


describe('Relatives Class', function() {

  it('is correctly instantiated', () => {
    expect(service).to.be.an('object');
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });

  it('returns 25 articles/items (internal call)', async () => {
    const relatives = await service.find({
      query:{
        qname:'o:cc1c5be57719dade0371'
      }
    });
    expect(relatives.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(10000);

  it('returns relatives as markdown (internal call)', async () => {
    const relatives = await service.find({
      query:{
        qname:'o:cc1c5be57719dade0371',
        format: 'markdown'
      }
    });
    expect(relatives.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(10000);

  it('returns raw items (internal call)', async () => {
    const relatives = await service.find({
      query:{
        qname:'o:cc1c5be57719dade0371',
        format: 'raw'
      }
    });
    expect(relatives.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(10000);

  it('limits the total of relatives (internal call)', async () => {
    const relatives = await service.find({
      query:{
        qname:'o:cc1c5be57719dade0371',
        limit: 5
      }
    });
    expect(relatives.items).to.be.an('array')
      .to.have.lengthOf(5);
  }).timeout(10000);

  it('skip relatives (internal call)', async () => {
    const relatives = await service.find({
      query:{
        qname:'o:cc1c5be57719dade0371', 
        limit: 5, 
        skip: 5
      }
    });
    expect(relatives.items).to.be.an('array')
      .to.have.lengthOf(5);
  }).timeout(10000);

  it('sortBy (internal call)', async () => {
    const relatives = await service.find({
      query:{
        qname:'o:cc1c5be57719dade0371', 
        sortBy: '_system.created_on.ms'
      }
    });
    expect(relatives.items).to.be.an('array')
      .to.have.lengthOf(25);
  }).timeout(10000);
});