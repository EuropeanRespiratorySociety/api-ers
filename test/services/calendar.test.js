const assert = require('assert');
const app = require('../../src/app');
const calendar = require('../../src/services/calendar/calendar.class');

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
          .that.is.an('array');
        expect(JSON.parse(res.text)).to.have.property('_sys')
          .that.is.an('object')
          .with.deep.property('status')
          .to.equal(200);
        done();
      });
  }).timeout(8000);

  it('calendar items are in chronological order', (done) => {
    chai.request(host) 
      .get('/calendar')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).data[0].calendar.timestamp)
          .to.be.a('number')
          .to.be.at.most(JSON.parse(res.text).data[1].calendar.timestamp);
        done();
      });
  }).timeout(4000);

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
  }).timeout(4000);

  it('returns calendar with markdown format', (done) => {
    chai.request(host) 
      .get('/calendar?format=markdown')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        const r = JSON.parse(res.text).data[0];
        
        if(r.leadParagraph) {
          expect(r.leadParagraph)
            .to.be.a('string')
            .not.to.include('<p>');
        }

        if(r.body) {
          expect(r.body)
            .to.be.a('string')
            .not.to.include('<p>');
        }

        done();
      });
  }).timeout(4000);


  it('returns raw calendar items', (done) => {
    chai.request(host) 
      .get('/calendar?format=raw&type=ers')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        //This test fails when there is no lead :(
        const data = JSON.parse(res.text).data;
        /* eslint-disable indent */
        data[0].leadParagraph
        ? expect(data[0].leadParagraph)
          .to.be.a('string')
          .not.to.include('<p>')
        : data[1].leadParagraph
        ? expect(data[1].leadParagraph)
          .to.be.a('string')
          .not.to.include('<p>')
        : data[2].leadParagraph
        ? expect(data[2].leadParagraph)
          .to.be.a('string')
          .not.to.include('<p>')
        : expect(data[0].leadParagraph).to.be.false;

        data[0].body
        ? expect(data[0].body)
          .to.be.a('string')
          .not.to.include('###')
        : data[1].body
        ? expect(data[1].body)
          .to.be.a('string')
          .not.to.include('###')
        : data[2].body
        ? expect(data[2].body)
          .to.be.a('string')
          .not.to.include('###')
        : expect(data[0].body).to.be.false;

        done();
      });
  }).timeout(4000);

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
  }).timeout(4000);
  
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
  }).timeout(4000);
  
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
  }).timeout(8000);
  
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
  }).timeout(4000);

  // ---------------
  // These tests might fail depending 
  // on what is published on the 
  // website when testing
  // ---------------

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
    
  // it('returns ers endorsed events', (done) => {
  //   chai.request(host) 
  //     .get('/calendar?type=spirometry')
  //     .set('Content-Type', 'application/json')
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(JSON.parse(res.text).data[0].type)
  //         .to.equal('Spirometry Programme');
  //       done();
  //     });
  // });

});

describe('Filter function', function() {
  it('sets default value (ers)', () => {
    const filter = calendar().setFilter('ers');
    expect(filter).to.be.an('object')
      .to.have.property('ersEndorsedEvent')
      .to.deep.equal({'$ne': true});
    expect(filter)
      .to.have.property('nonErsCalendarItem')
      .to.deep.equal({'$ne': true});
  });

  it('sets deadline', () => {
    const filter = calendar().setFilter('deadline');
    expect(filter).to.be.an('object')
      .to.have.property('ersDeadline')
      .to.be.ok;
  });

  it('sets endrorsed', () => {
    const filter = calendar().setFilter('endorsed');
    expect(filter).to.be.an('object')
      .to.have.property('ersEndorsedEvent')
      .to.be.ok;
  });

  it('sets non-ers', () => {
    const filter = calendar().setFilter('non-ers');
    expect(filter).to.be.an('object')
      .to.have.property('nonErsCalendarItem')
      .to.be.ok;
  });

  it('sets spirometry', () => {
    const filter = calendar().setFilter('spirometry');
    expect(filter).to.be.an('object')
      .to.have.property('type')
      .to.equal('Spirometry Programme');
  });

  it('sets hermes', () => {
    const filter = calendar().setFilter('hermes');
    expect(filter).to.be.an('object')
      .to.have.property('type')
      .to.equal('ERS HERMES');
  });

  it('returns an empty object', () => {
    const filter = calendar().setFilter();
    expect(filter).to.be.an('object').to.deep.equal({});
  });
});