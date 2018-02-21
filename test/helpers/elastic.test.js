const chai = require('chai');
const expect = chai.expect;

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
});