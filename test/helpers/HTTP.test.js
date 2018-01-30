const chai = require('chai');
const expect = chai.expect;

const r = require('../../src/helpers/HTTP');

describe('\'HTTP\' helper', () => {
  it('creates a HTTP method', () => {
    expect(r).to.be.a('function');
  });
  
  it('gives access to methods', () => {
    const result = r('test/url', '123456-test-token');
    expect(result.defaults.headers).to.be.an('object')
      .to.have.property('Authorization')
      .to.equal('Bearer 123456-test-token');
    expect(result.defaults.baseURL).to.be.a('string')
      .to.equal('test/url');
  });
});