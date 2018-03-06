const assert = require('assert');
const app = require('../../src/app');

const chai = require('chai');
const chaiHttp = require('chai-http');

//use http plugin
chai.use(chaiHttp);
const expect = chai.expect;
const host = process.env.API_URL;

describe('\'interests\' service', () => {
  it('registered the service', () => {
    const service = app.service('interests');

    assert.ok(service, 'Registered the service');
  });
});

describe('Request to the interests service', () => {
  
  it('returns iterests data', (done) => {
    chai.request(host) 
      .get('/interests')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        const data = JSON.parse(res.text);
        
        expect(res).to.have.status(200);
        expect(data).to.have.property('data')
          .that.is.an('array');
        expect(data.data[0])
          .that.is.an('object')
          .with.deep.property('title')
          .that.is.a('string');
        expect(data.data[0])
          .that.is.an('object')
          .with.deep.property('values')
          .that.is.an('array');
        expect(data.data[0])
          .that.is.an('object')
          .with.deep.property('limits')
          .that.is.an('object')
          .with.deep.property('min')
          .that.is.a('number');
        expect(data).to.have.property('cache')
          .that.is.an('object')
          .with.deep.property('duration')
          .that.is.a('number');
        done();
      });
  }).timeout(4000);
});
