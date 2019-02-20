const cc = require('../../src/cloudcms');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../src/app');
const dotenv = require('dotenv');
/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
dotenv.load();

// const cc = require('../../src/cloudcms');

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
    expect(digests.items).to.be.an('array')
      .to.have.lengthOf.at.least(1);
  }).timeout(100000);

  xit('find digest articles filtered by disease', async () => {
    const digests = await service.find({
      query: {
        full: false,
        filterBy: 'Airway diseases'
      }
    });
    expect(digests.items).to.be.an('array')
      .to.have.lengthOf(1);
  }).timeout(100000);

  xit('get digest articles by slug', async () => {
    const digests = await service.get('test');
    expect(digests.item).to.be.an('array')
      .to.have.lengthOf(1);
    expect(digests.item[0].slug).to.be.equal('test');
  }).timeout(100000);
});
