
const chai = require('chai');
const expect = chai.expect;

const s = require('../../src/helpers/queryParams');
const qname = 'this:isaqname';

describe('\'queryParams\' helper', () => {
  it('is correctly imported', () => {
    expect(s).to.be.a('function');
  });

  it('returns default values', () => {
    const obj = s(qname);
    expect(obj).to.be.an('object')
      .to.have.property('qname').to.equal('this:isaqname');
    expect(obj).to.have.property('full').to.equal(false);
    expect(obj).to.have.property('md').to.equal(false);
    expect(obj).to.have.property('skip').to.equal(0);
    expect(obj).to.have.property('limit').to.equal(25);
  });

  it('returns full:true', () => {
    const query = {full: true};
    const obj = s(qname, query);

    expect(obj).to.be.an('object')
      .to.have.property('qname').to.equal('this:isaqname');
    expect(obj).to.have.property('full').to.equal(true);
    expect(obj).to.have.property('md').to.equal(false);
    expect(obj).to.have.property('skip').to.equal(0);
    expect(obj).to.have.property('limit').to.equal(25);
  });

  it('returns md:true', () => {
    const query = {md: true};
    const obj = s(qname, query);

    expect(obj).to.be.an('object')
      .to.have.property('qname').to.equal('this:isaqname');
    expect(obj).to.have.property('full').to.equal(false);
    expect(obj).to.have.property('md').to.equal(true);
    expect(obj).to.have.property('skip').to.equal(0);
    expect(obj).to.have.property('limit').to.equal(25);
  });

  it('returns skip:25', () => {
    const query = {skip: 25};
    const obj = s(qname, query);

    expect(obj).to.be.an('object')
      .to.have.property('qname').to.equal('this:isaqname');
    expect(obj).to.have.property('full').to.equal(false);
    expect(obj).to.have.property('md').to.equal(false);
    expect(obj).to.have.property('skip').to.equal(25);
    expect(obj).to.have.property('limit').to.equal(25);
  });

  it('returns limit:5', () => {
    const query = {limit: 5};
    const obj = s(qname, query);

    expect(obj).to.be.an('object')
      .to.have.property('qname').to.equal('this:isaqname');
    expect(obj).to.have.property('full').to.equal(false);
    expect(obj).to.have.property('md').to.equal(false);
    expect(obj).to.have.property('skip').to.equal(0);
    expect(obj).to.have.property('limit').to.equal(5);
  });

  it('returns defaults for properties that are not supported', () => {
    const query = {something: 5, blabla: 12, string: 'string'};
    const obj = s(qname, query);

    expect(obj).to.be.an('object')
      .to.have.property('qname').to.equal('this:isaqname');
    expect(obj).to.have.property('full').to.equal(false);
    expect(obj).to.have.property('md').to.equal(false);
    expect(obj).to.have.property('skip').to.equal(0);
    expect(obj).to.have.property('limit').to.equal(25);
  });
});