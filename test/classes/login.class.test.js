const cc = require('../../src/cloudcms');
const chai = require('chai');
const expect = chai.expect;

const app = require('../../src/app');
const paginate = app.get('paginate');

const dotenv = require('dotenv');
dotenv.load();

// const cc = require('../../src/cloudcms');

// Creating the service
const createService = require('../../src/services/login/login.class');
app.use('/news', createService({paginate}));
const service = app.service('news');


describe('Login Class', function() {
  /**
   * To run these test we create a new server as we want it
   * to have these test independently. The aim is to test
   * specifically the classe
   * @TODO Imrpove those tests ;)
   */
  before(function(done) {
    if(!this.server) {
      this.timeout(10000);
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
    expect(service).to.respondTo('create');
  });

  it('handles wrong credentials', async () => {
    try {
      await service.create({
        username: 'abcdef',
        password: 'ghijkl'
      });
    } catch (e) {
      expect(e.name).to.equal('NotAuthenticated');
      expect(e.code).to.equal(401);
    }
  });

  // it('logs in', async () => {
  //   const r = await service.create({
  //     username: process.env.MY_CRM_TEST_USER,
  //     password: process.env.MY_CRM_TEST_PW
  //   });

  // });

});