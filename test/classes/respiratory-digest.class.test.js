const cc = require('../../src/cloudcms');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../src/app');
const dotenv = require('dotenv');
/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
dotenv.load();

// Getting the service (we need hooks)
const service = app.service('respiratory-digest');

describe('Respiratory digest Class', function () {
  before(function (done) {
    if (!this.server) {
      this.timeout(30000);
      cc();
      process.once('Cloud CMS connected', () => {
        this.server = app.listen(3032);
        this.server.on('listening', () => {
          done();
        });
      });
    }
  });

  after(function (done) {
    this.server.close(done);
  });

  it('is correctly instantiated', () => {
    expect(service).to.be.an('object');
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });

  it('find digest articles', async () => {
    const digests = await service.find({
      query: {
        full: false
      }
    });
    expect(digests.data).to.be.an('array')
      .to.have.lengthOf.at.least(1);
  }).timeout(10000);

});
