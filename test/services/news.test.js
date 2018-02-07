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

describe('\'news\' service', () => {
  it('registered the service', () => {
    const service = app.service('news');

    assert.ok(service, 'Registered the service');
  });
});

let firstItem = '';

describe('Request to the news service', function() {

  it('returns news', (done) => {
    chai.request(host) 
      .get('/news')
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
  });

  it('limits the total of news', (done) => {
    chai.request(host) 
      .get('/news?limit=5')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array')
          .to.have.lengthOf(5);
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('next')
          .to.equal(host + '/news?limit=5&skip=5');
        done();
      });
  });

  it('skips news', (done) => {
    chai.request(host) 
      .get('/news?limit=5&skip=5')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array')
          .to.have.lengthOf(5);
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('next')
          .to.equal(host + '/news?limit=5&skip=10');
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('prev')
          .to.equal(host + '/news?limit=5&skip=0');
        done();
      });
  });  

  it('returns all properties', (done) => {
    chai.request(host) 
      .get('/news?limit=1&full=true')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array')
          .to.have.lengthOf(1); // This is to speed up the test no need to bring back 25 full items
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array');
        done();
      });
  });

  it('returns a news by slug', (done) => {
    console.log('first item: ', firstItem);
    chai.request(host) 
      .get('/news/' + firstItem)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('object')
          .with.property('title')
          .that.is.a('String');
        done();
      });
  });

});
