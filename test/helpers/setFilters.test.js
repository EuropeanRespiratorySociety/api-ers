
const chai = require('chai');
const expect = chai.expect;

const s = require('../../src/helpers/setFilters');

describe('\'setFilters\' helper', () => {
  it('is correctly imported', () => {
    expect(s).to.be.a('function');
  });

  it('returns default values', () => {
    const obj = s();
    expect(obj).to.be.an('object');
    expect(obj).to.be.empty;
  });

  it('returns default when params is false (boolean)', () => {
    const obj = s(false);
    expect(obj).to.be.an('object');
    expect(obj).to.be.empty;
  });

  it('sets filter for a given string', () => {
    const obj = s('Airway diseases,Public health');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('$or')
      .to.be.an('array')
      .to.have.lengthOf(2);
    expect(obj.$or[0]).to.been.an('object')
      .to.haveOwnProperty('diseases')
      .to.be.an('object')
      .to.haveOwnProperty('$in')
      .to.be.an('array')
      .to.have.lengthOf(2);
    expect(obj.$or[1].methods.$in[0]).to.equal('Airway diseases');
    expect(obj.$or[1].methods.$in[1]).to.equal('Public health');
  });

  it('sets filter for highlights', () => {
    const obj = s('highlights');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('availableOnHomepage')
      .to.be.an('string') // @TODO this needs to change to a boolean
      .to.equal('true');
  });

  it('sets filter for mainNews', () => {
    const obj = s('main-news');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('mainNews')
      .to.be.a('boolean')
      .to.be.true;
  });

  it('sets filter to reject highlights', () => {
    const obj = s('no-highlights');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('availableOnHomepage')
      .to.be.an('object') 
      .to.haveOwnProperty('$ne')
      .to.be.a('string')// @TODO this needs to change to a boolean
      .to.equal('true');
    expect(obj).to.haveOwnProperty('mainNews')
      .to.be.an('object') 
      .to.haveOwnProperty('$ne')
      .to.be.a('boolean')// @TODO this needs to change to a boolean
      .to.be.true;
  });
});