const chai = require('chai');
const chaiHttp = require('chai-http');

//use http plugin
chai.use(chaiHttp);
var expect = chai.expect;

const dotenv = require('dotenv');
dotenv.load();
const host = process.env.API_URL;

describe('Graphql endpoint', function() {
  
  it('returns latest news titles', (done) => {
    chai.request(host) 
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({ 
        'query': 'query{news{title}}' 
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data')
          .that.is.an('object');
        expect(res.body.data).to.have.property('news')
          .that.is.an('array')
          .to.have.lengthOf(25);
        expect(res.body.data.news[0]).to.have.property('title')
          .that.is.a('string');
        expect(res.body.data.news[0]).not.to.have.property('body');
        done();
      });
  }); 

  it('returns latest news titles and bodies', (done) => {
    chai.request(host) 
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({ 
        'query': 'query{news{title,body}}' 
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data')
          .that.is.an('object');
        expect(res.body.data).to.have.property('news')
          .that.is.an('array')
          .to.have.lengthOf(25);
        expect(res.body.data.news[0]).to.have.property('title')
          .that.is.a('string');
        expect(res.body.data.news[0]).to.have.property('body');
        done();
      });
  });

  it('returns the title of the latest article', (done) => {
    chai.request(host) 
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({ 
        'query': 'query($limit:Int){news(limit:$limit){title}}',
        'variables': '{"limit": 1}' 
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data')
          .that.is.an('object');
        expect(res.body.data).to.have.property('news')
          .that.is.an('array')
          .to.have.lengthOf(1);
        expect(res.body.data.news[0]).to.have.property('title')
          .that.is.a('string');
        expect(res.body.data.news[0]).not.to.have.property('body');
        done();
      });
  });

    
  it('does not return users', (done) => {
    chai.request(host) 
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({ 
        'query': 'query{users{email}}' 
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data')
          .that.is.an('object');
        expect(res.body).to.have.property('errors')
          .that.is.an('array');
        expect(res.body.errors[0].message).to.equal('No auth token');
        done();
      });
  }); 

});
