const assert = require('assert');
const app = require('../../src/app');

const chai = require('chai');
const chaiHttp = require('chai-http');

//use http plugin
chai.use(chaiHttp);
const expect = chai.expect;
const service = app.service('filters');

describe('\'filters\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
});

describe('filters', () => {
  it('returns user filters with url and label for courses', (done) => {
    service.get('courses').then(res => {
      expect(res).to.be.an('object')
        .to.have.property('filters')
        .to.be.an('object')
        .to.have.property('user')
        .to.be.an('array');

      expect(res.filters.user[0]).to.be.an('object')
        .to.have.property('url'); 
      expect(res.filters.user[0]).to.be.an('object')
        .to.have.property('label');
      expect(res._sys).to.be.an('object')
        .to.have.property('status').to.equal(200);
      done();
    });
  }).timeout(4000);

  it('returns user filters with url and label for calendar', (done) => {
    service.get('calendar').then(res => {
      expect(res).to.be.an('object')
        .to.have.property('filters')
        .to.be.an('object')
        .to.have.property('user')
        .to.be.an('array');

      expect(res.filters.user[0]).to.be.an('object')
        .to.have.property('url'); 
      expect(res.filters.user[0]).to.be.an('object')
        .to.have.property('label');
      expect(res._sys).to.be.an('object')
        .to.have.property('status').to.equal(200);
      done();
    });
  }).timeout(4000);

  it('returns system filters with url and no label for calendar', (done) => {
    service.get('calendar').then(res => {
      expect(res.filters.system[0]).to.be.an('object')
        .to.have.property('url'); 
      expect(res.filters.system[0]).to.be.an('object')
        .to.have.property('label').to.equal(undefined); 
      expect(res._sys).to.be.an('object')
        .to.have.property('status').to.equal(200);
      done();
    });
  }).timeout(4000);

  it('returns default value for endpoint without filters', (done) => {
    service.get('test').then(res => {
      expect(res._sys).to.be.an('object')
        .to.have.property('status').to.equal(204);
      done();
    });
  }).timeout(4000);
});
