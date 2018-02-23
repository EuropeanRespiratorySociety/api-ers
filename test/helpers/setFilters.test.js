
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

  
});