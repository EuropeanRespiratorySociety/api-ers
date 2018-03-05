const chai = require('chai');
const expect = chai.expect;

const service = require('../../src/services/webhook/webhook.class');
const u = new service;


describe('\'webhook\' class', () => {
  it('is correctly imported', () => {
    expect(u).to.be.an('object');
  });
  
  it('gives access to methods', () => {
    expect(u).to.respondTo('find');
    expect(u).to.respondTo('create');
  });
});