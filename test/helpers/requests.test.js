const chai = require('chai');
const expect = chai.expect;

const r = require('../../src/helpers/requests');

describe('\'request\' helper', () => {
  it('is correctly imported', () => {
    expect(r).to.be.an('object');
  });
  
  it('gives access to methods', () => {
    expect(r).to.respondTo('menuItems');
    expect(r).to.respondTo('item');
    expect(r).to.respondTo('breadcrumb');
    expect(r).to.respondTo('relatives');
  });
});