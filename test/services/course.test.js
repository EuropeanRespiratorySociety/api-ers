const assert = require('assert');
const app = require('../../src/app');

const chai = require('chai');
const chaiHttp = require('chai-http');

//use http plugin
chai.use(chaiHttp);
var expect = chai.expect;

const dotenv = require('dotenv');
dotenv.load();
const host = process.env.API_URL;

describe('\'courses\' service', () => {
  it('registered the service', () => {
    const service = app.service('courses');

    assert.ok(service, 'Registered the service');
  });
});

let firstItem = '';

describe('Request to the course service', function() {

  it('returns all course items', (done) => {
    chai.request(host) 
      .get('/courses')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        firstItem = JSON.parse(res.text).data[0].slug;
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array');
        expect(JSON.parse(res.text)).to.have.property('category')
          .that.is.an('array');
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('status')
          .to.equal(200);
        done();
      });
  }).timeout(4000);

  it('returns a course by slug', (done) => {
    chai.request(host) 
      .get('/courses/' + firstItem)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('object')
          .with.property('title')
          .that.is.a('String');
        done();
      });
  }).timeout(4000);

});
