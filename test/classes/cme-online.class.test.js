const cc = require('../../src/cloudcms');
const chai = require('chai');
const expect = chai.expect;
const cmeModuleMock = require('../mocks/cmeModuleCreate.json');

const app = require('../../src/app');

const dotenv = require('dotenv');
dotenv.load();

// const cc = require('../../src/cloudcms');

// Getting the service (we need hooks)
const service = app.service('cme-online');

describe('Cme Online Class', function () {
  /**
   * To run these test we create a new server as we want it
   * to have these test independently. The aim is to test
   * specifically the classe
   * @TODO Improve those tests ;)
   */
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

  xit('is correctly instantiated', () => {
    expect(service).to.be.an('object');
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
    expect(service).to.respondTo('create');
  });

  xit('get cme module', async () => {
    try {
      const cmeModule = await service.get(cmeModuleMock.slug);
      expect(cmeModule.item[0].title).to.equal(cmeModuleMock.title);
    } catch (e) {
      expect(true).to.equal(false);
    }
  }).timeout(10000);

  xit('creates new cme module', async () => {
    try {
      const resultCreate = await service.create(cmeModuleMock);
      expect(resultCreate.status).to.equal(201);
    } catch (e) {
      expect(true).to.equal(false);
    }
  }).timeout(10000);

  xit('delete cme module', async () => {
    try {
      const resultRemove = await service.remove(cmeModuleMock.slug);
      expect(resultRemove.status).to.equal(200);
    } catch (e) {
      expect(true).to.equal(false);
    }
  }).timeout(10000);
});
