const chai = require('chai');
const expect = chai.expect;

const u = require('../../src/services/webhook/webhook.cache');


describe('\'webhook\' cache', () => {
  it('is correctly imported', () => {
    expect(u).to.be.an('object');
  });
  
  it('gives access to methods', () => {
    expect(u).to.respondTo('client');
    expect(u).to.respondTo('clear');
    expect(u).to.respondTo('e');
  });
});