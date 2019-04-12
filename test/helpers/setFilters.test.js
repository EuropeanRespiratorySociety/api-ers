const chai = require('chai');
const expect = chai.expect;

const s = require('../../src/helpers/setFilters');
const setFilter = s.setFilter;
const setCmeOnlineFilter = s.setCmeOnlineFilter;

describe('\'setFilters setFilter\' helper', () => {
  it('is correctly imported', () => {
    expect(setFilter).to.be.a('function');
  });

  it('returns default values', () => {
    const obj = setFilter();
    expect(obj).to.be.an('object');
    expect(obj).to.be.empty;
  });

  it('returns default when params is false (boolean)', () => {
    const obj = setFilter(false);
    expect(obj).to.be.an('object');
    expect(obj).to.be.empty;
  });

  it('sets filter for a given string', () => {
    const obj = setFilter('Airway diseases,Public health');
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
    const obj = setFilter('highlights');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('availableOnHomepage')
      .to.be.an('string') // @TODO this needs to change to a boolean
      .to.equal('true');
  });

  it('sets filter for mainNews', () => {
    const obj = setFilter('main-news');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('mainNews')
      .to.be.a('boolean')
      .to.be.true;
  });

  it('sets filter to reject highlights', () => {
    const obj = setFilter('no-highlights');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('availableOnHomepage')
      .to.be.an('object')
      .to.haveOwnProperty('$ne')
      .to.be.a('string') // @TODO this needs to change to a boolean
      .to.equal('true');
    expect(obj).to.haveOwnProperty('mainNews')
      .to.be.an('object')
      .to.haveOwnProperty('$ne')
      .to.be.a('boolean') // @TODO this needs to change to a boolean
      .to.be.true;
  });
});

describe('\'setFilters setCmeOnlineFilter\' helper', () => {
  it('is correctly imported', () => {
    expect(setCmeOnlineFilter).to.be.a('function');
  });

  it('returns default values', () => {
    const obj = setCmeOnlineFilter();
    expect(obj).to.be.an('object');
    expect(obj).to.be.empty;
  });

  it('sets interest filter', () => {
    const obj = setCmeOnlineFilter(' Airway diseases,Public health', false, false);
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
    expect(obj).to.not.haveOwnProperty('cmeType');
    expect(obj).to.not.haveOwnProperty('cmeCategories');
  });

  it('sets type cme filter', () => {
    const obj = setCmeOnlineFilter(false, 'case, topic', false);
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('cmeType')
      .to.be.an('object');
    expect(obj.cmeType.$in[0]).to.equal('case');
    expect(obj.cmeType.$in[1]).to.equal('topic');
    expect(obj).to.not.haveOwnProperty('$or');
    expect(obj).to.not.haveOwnProperty('cmeCategories');
  });

  it('sets category cme filter', () => {
    const obj = setCmeOnlineFilter(false, false, 'COPD, Other');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('cmeCategories')
      .to.be.an('object');
    expect(obj.cmeCategories.$in[0]).to.equal('COPD');
    expect(obj.cmeCategories.$in[1]).to.equal('Other');
    expect(obj).to.not.haveOwnProperty('$or');
    expect(obj).to.not.haveOwnProperty('cmeType');
  });

  it('sets interest and cme type and cme cmeCategories filter', () => {
    const obj = setCmeOnlineFilter('Airway diseases,Public health', 'case, topic', 'COPD, Other');
    expect(obj).to.be.an('object');
    expect(obj).to.haveOwnProperty('$or')
      .to.be.an('array')
      .to.have.lengthOf(2);
    expect(obj).to.haveOwnProperty('cmeType')
      .to.be.an('object');
    expect(obj.cmeType.$in).to.be.an('array')
      .to.have.lengthOf(2);
    expect(obj).to.haveOwnProperty('cmeCategories')
      .to.be.an('object');
    expect(obj.cmeCategories.$in).to.be.an('array')
      .to.have.lengthOf(2);
  });
});
