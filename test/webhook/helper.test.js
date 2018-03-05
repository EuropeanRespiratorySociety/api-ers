const chai = require('chai');
const expect = chai.expect;

const u = require('../../src/services/webhook/webhook.helpers');


describe('\'webhook\' helpers', () => {
  it('is correctly imported', () => {
    expect(u).to.be.an('object');
  });
  
  it('gives access to methods', () => {
    expect(u).to.respondTo('client');
    expect(u).to.respondTo('k4');
    expect(u).to.respondTo('upsertSessions');
    expect(u).to.respondTo('upsertPresentations');
    expect(u).to.respondTo('upsertAbstracts');
    expect(u).to.respondTo('upsertJournalAbstract');
    expect(u).to.respondTo('indexErsContent');
    expect(u).to.respondTo('indexJournals');
    expect(u).to.respondTo('indexCongress');
  });
});