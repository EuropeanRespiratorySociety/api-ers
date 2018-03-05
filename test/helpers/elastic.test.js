const chai = require('chai');
const expect = chai.expect;
const m = require('moment');

const r = require('../../src/helpers/elastic');

const dotenv = require('dotenv');
dotenv.load();


// 1. create an index for testing purposes
// 2. add some mock data
// 3. test
// 4. delete the index

describe('\'elastic\' helper', () => {
  it('is correctly imported', () => {
    
    expect(r).to.be.an('object');
  });

  it('is correctly configured', () => {
    expect(r.client.transport._config.host).to.be.contain('https://api:');
  });
  
  it('gives access to methods', () => {
    expect(r).to.respondTo('log');
    expect(r).to.respondTo('index');
  });

  it('logs data in a test index', async () => {
    const now = m().format();
    const response = await r.log('test', '_doc', {id: now, test:'some content'});

    expect(response)
      .to.be.an('object')
      .to.haveOwnProperty('_index').to.equal('test');
    expect(response).to.be.an('object')
      .to.haveOwnProperty('_type')
      .to.equal('_doc');
    expect(response).to.be.an('object')
      .to.haveOwnProperty('result')
      .to.equal('created');
  });

  it('index data in a test index', async () => {
    const response = await r.index({_doc: '123456', test:'some content'},'test-index');

    expect(response)
      .to.be.an('object')
      .to.haveOwnProperty('_index').to.equal('test-index');
    expect(response).to.be.an('object')
      .to.haveOwnProperty('_type')
      .to.equal('_doc');
    expect(response).to.be.an('object')
      .to.haveOwnProperty('result')
      .to.equal('created');
    expect(response).to.be.an('object')
      .to.haveOwnProperty('_id')
      .to.equal('123456');
  });

  it('index data in a test index with arbitrary id', async () => {
    const response = await r.index({test:'some content'},'test-index', '123abc');

    expect(response)
      .to.be.an('object')
      .to.haveOwnProperty('_index').to.equal('test-index');
    expect(response).to.be.an('object')
      .to.haveOwnProperty('_type')
      .to.equal('_doc');
    expect(response).to.be.an('object')
      .to.haveOwnProperty('result')
      .to.equal('created');
    expect(response).to.be.an('object')
      .to.haveOwnProperty('_id')
      .to.equal('123abc');
  });

  after(async () => {
    await r.client.indices.delete({index:'test,test-index'});
  });
});