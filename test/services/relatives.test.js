const assert = require('assert');
const app = require('../../src/app');
const service = app.service('relatives');

describe('\'relatives\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('has methods find() and get() available', () => {
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });
});

//expect(Object.keys(res.body.data[0]).length).to.be.at.least(92); 

const chai = require('chai');
const chaiHttp = require('chai-http');

//use http plugin
chai.use(chaiHttp);
var expect = chai.expect;

const dotenv = require('dotenv');
dotenv.load();
const host = process.env.API_URL;

let firstItem = '';

describe('Request to the relatives (associated nodes) service', function() {

  it('returns 25 articles/items', (done) => {
    this.timeout(4000);
    chai.request(host) 
      .get('/relatives?qname=o:cc1c5be57719dade0371')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        firstItem = JSON.parse(res.text).data[0].slug;
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array')
          .to.have.lengthOf(25);
        expect(Object.keys(JSON.parse(res.text).data[0]).length)
          .to.be.at.most(45);   
        expect(JSON.parse(res.text)).to.have.property('category')
          .that.is.an('array');
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('status')
          .to.equal(200);
        done();
      });
  });

  it('returns 1 article/item', (done) => {
    this.timeout(4000);
    chai.request(host) 
      .get('/relatives?qname=o:cc1c5be57719dade0371&limit=1')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        firstItem = JSON.parse(res.text).data[0].slug;
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array')
          .to.have.lengthOf(1);   
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('next')
          .to.equal(host + '/relatives?qname=o:cc1c5be57719dade0371&limit=1&full=false&skip=1');  
        done();
      });
  });

  it('returns 25 articles/items with full content', (done) => {
    this.timeout(4000);
    chai.request(host) 
      .get('/relatives?qname=o:cc1c5be57719dade0371&full=true')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array')
          .to.have.lengthOf(25);
        expect(JSON.parse(res.text)).to.have.property('category')
          .that.is.an('array');
        expect(Object.keys(JSON.parse(res.text).data[0]).length).to.be.at.least(92); 
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('status')
          .to.equal(200);
        done();
      });
  });

  it('returns an item by slug', (done) => {
    this.timeout(4000);
    chai.request(host) 
      .get('/relatives/' + firstItem)
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