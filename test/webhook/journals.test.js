const chai = require('chai');
const expect = chai.expect;

const u = require('../../src/services/webhook/webhook.journals');


describe('\'webhook\' helpers', () => {
  it('is correctly imported', () => {
    expect(u).to.be.an('object');
  });
  
  it('gives access to methods', () => {
    expect(u).to.respondTo('upsertJournalAbstract');
    expect(u).to.respondTo('indexJournals');
  });
});