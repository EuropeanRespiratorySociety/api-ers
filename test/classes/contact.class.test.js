const cc = require('../../src/cloudcms');
const chai = require('chai');
const expect = chai.expect;

const app = require('../../src/app');
// const paginate = app.get('paginate');

const dotenv = require('dotenv');
dotenv.load();

// const cc = require('../../src/cloudcms');

// Getting the service (we need hooks)
const service = app.service('ers/contacts');

describe('Contacts Class', function() {
  /**
   * To run these test we create a new server as we want it
   * to have these test independently. The aim is to test
   * specifically the classe
   * @TODO Imrpove those tests ;)
   */
  before(function(done) {
    if(!this.server) {
      this.timeout(30000);
      cc();
      process.once('Cloud CMS connected', () => {
        this.server = app.listen(3031);
        this.server.on('listening', () => {
          done();
        });
      });
    }
  });

  after(function(done) {
    this.server.close(done);
  });

  it('is correctly instantiated', () => {
    expect(service).to.be.an('object');
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });

  it('checks that there is a patern', async () => {
    try {
      await service.find({
        query:{
        }
      });
    } catch (e) {
      expect(e.name).to.equal('BadRequest');
      expect(e.code).to.equal(400);
    }
  });

  it('does not find anyone', async () => {
    try {
      await service.find({
        query:{
          pattern: 'xxxxxx'
        }
      });
    } catch (e) {
      expect(e.name).to.equal('NotFound');
      expect(e.code).to.equal(404);
    }
  });

  it('does not find a contact', async () => {
    this.timeout(10000);
    try {
      await service.get(10000000000);
    } catch (e) {
      expect(e.name).to.equal('NotFound');
      expect(e.code).to.equal(404);
    }
  });

  it('finds contacts', async () => {
    this.timeout(10000);
    const r = await service.find({
      query:{
        pattern: 'pou'
      }
    });
    expect(r.data).to.be.an('array');
    expect(r.data[0]).to.be.an('object')
      .to.haveOwnProperty('ContactId');
    expect(r).to.haveOwnProperty('status')
      .to.equal(200);
    expect(r).to.haveOwnProperty('cache')
      .to.be.an('object')
      .to.haveOwnProperty('cached').to.be.ok;
  });

  it('finds a contact', async () => {
    this.timeout(10000);
    const r = await service.get(203041);
    expect(r.data).to.be.an('object')
      .to.haveOwnProperty('ContactId')
      .to.equal(203041);
    // expect(r).to.haveOwnProperty('cache')
    //   .to.be.an('object')
    //   .to.haveOwnProperty('cached').to.be.ok;
  });

});