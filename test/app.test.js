const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

//use http plugin
chai.use(chaiHttp);
var expect = chai.expect;

describe('General application tests', function() {
  // before(function(done) {
  //   this.server = app.listen(3030);
  //   this.server.once('listening', () => done());
  // }); 

  // after(function(done) {
  //   this.server.close(done);
  // });

  it('starts and shows the index page', (done) => {
    chai.request(app) 
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('starts and shows the index page', (done) => {
    chai.request(app) 
      .get('/login.html')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});  

describe('404', function() {
  it('shows a 404 HTML page', (done) => {
    chai.request(app)
      .get('/path/to/nowhere')
      .set('Content-type', 'text/html')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.html;
        done();
      });
  });

  it('shows a 404 JSON error without stack trace', (done) => {
    chai.request(app)
      .get('/path/to/nojson')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res).to.be.json;
        expect(JSON.parse(res.text)).to.have.property('name')
          .that.equals('NotFound');
        expect(JSON.parse(res.text)).to.have.property('code')
          .that.equals(404);

        done();
      });
  });
});

