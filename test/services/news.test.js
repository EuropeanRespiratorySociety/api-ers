const assert = require('assert');
const app = require('../../src/app');

const chai = require('chai');
const chaiHttp = require('chai-http');

//use http plugin
chai.use(chaiHttp);
const expect = chai.expect;

const dotenv = require('dotenv');
dotenv.load();
const host = process.env.API_URL;

const service = app.service('news');

describe('\'news\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('has methods find() and get() available', () => {
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });
});

let firstItem;

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
  }).timeout(4000);

  it('returns raw news', (done) => {
    chai.request(host) 
      .get('/news?format=raw')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(JSON.parse(res.text).data[0].leadParagraph)
          .to.be.a('string')
          .not.to.include('<p>');
        expect(JSON.parse(res.text).data[0].body)
          .to.be.a('string')
          .not.to.include('###');
        expect(JSON.parse(res.text).data[0].body)
          .to.be.a('string');
        done();
      });
  }).timeout(4000);

  it('returns news as markdown', (done) => {
    chai.request(host) 
      .get('/news?format=markdown')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).data[0].leadParagraph)
          .to.be.a('string')
          .not.to.include('<p>');
        done();
      });
  }).timeout(4000);

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
  }).timeout(4000);

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
  }).timeout(4000);

  it('sortBy', (done) => {
    chai.request(host) 
      .get('/news?sortBy=_system.created_on.ms')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .to.have.lengthOf(25);
        done();
      });
  }).timeout(4000);

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
  }).timeout(4000);

  it('returns a news by slug', (done) => {
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
  }).timeout(4000);

});
