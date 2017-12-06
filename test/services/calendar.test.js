const assert = require('assert');
const app = require('../../src/app');

const chai = require('chai');
const chaiHttp = require('chai-http');

//use http plugin
chai.use(chaiHttp);
const expect = chai.expect;
const host = process.env.API_URL;

describe('\'calendar\' service', () => {
  it('registered the service', () => {
    const service = app.service('calendar');

    assert.ok(service, 'Registered the service');
  });
});

describe('Request to the calendar service', function() {
  
  it('returns calendar items', (done) => {
    chai.request(host) 
      .get('/calendar')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('array');
        expect(JSON.parse(res.text)).to.have.property('category')
          .that.is.a('string');
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('status')
          .to.equal(200);
        done();
      });
  });

  it('calendar items are in chronological order', (done) => {
    chai.request(host) 
      .get('/calendar')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).data[0].calendar.timestamp)
          .to.be.a('number')
          .to.be.below(JSON.parse(res.text).data[1].calendar.timestamp);
        done();
      });
  });

  it('returns calendar items in reverse order', (done) => {
    chai.request(host) 
      .get('/calendar?reverse=true')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).data[0].calendar.timestamp)
          .to.be.a('number')
          .to.be.above(JSON.parse(res.text).data[1].calendar.timestamp);
        done();
      });
  });

  it('returns calendar with markdown format', (done) => {
    chai.request(host) 
      .get('/calendar?md=true')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).data[0].leadParagraph)
          .to.be.a('string')
          .not.to.include('<p>');
        done();
      });
  });

  it('returns a timeline of calendar items', (done) => {
    chai.request(host) 
      .get('/calendar?timeline=true')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text)).to.have.property('data')
          .that.is.an('object');
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('status')
          .to.equal(200);
        done();
      });
  });
  
  it('returns ERS events only', (done) => {
    chai.request(host) 
      .get('/calendar?type=ers')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).data[0].ersEndorsedEvent)
          .not.to.be.ok;
        expect(JSON.parse(res.text).data[0].nonErsCalendarItem)
          .not.to.be.ok;
        done();
      });
  });
  
  it('returns non-ers events', (done) => {
    chai.request(host) 
      .get('/calendar?type=non-ers')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).data[0].ersEndorsedEvent)
          .not.to.be.ok;
        expect(JSON.parse(res.text).data[0].nonErsCalendarItem)
          .to.be.true;
        done();
      });
  });
  
  it('returns ers endorsed events', (done) => {
    chai.request(host) 
      .get('/calendar?type=endorsed')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).data[0].ersEndorsedEvent)
          .to.be.true;
        done();
      });
  });

    
  // it('returns ers endorsed events', (done) => {
  //   chai.request(host) 
  //     .get('/calendar?type=deadline')
  //     .set('Content-Type', 'application/json')
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(JSON.parse(res.text).data[0].ersDeadline)
  //         .to.be.true;
  //       done();
  //     });
  // });

});    