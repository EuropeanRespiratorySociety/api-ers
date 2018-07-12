const assert = require('assert');
const communityMapping = require('../../src/hooks/community-mapping');
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');


describe('\'communityMapping\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      result: { data: [] }
    };
    // Initialize our hook with no options
    const hook = communityMapping();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});

describe('\'communityMapping\' hook', () => {
  it('transforms propreties', () => {
    const mockObject = require('../mocks/community-map.json');
    const mock = {
      result: {...mockObject}
    };

    // Initialize our hook with no options
    const hook = communityMapping();

    return hook(mock).then(result => {
      expect(result.result).to.have.ownProperty('data')
        .to.be.an('array');
      expect(result.result.data[0].content).to.equal(mockObject.data[0].title);
      expect(result.result.data[0].content.fp_status).to.equal(result.result.data[0].content.fp_status);
      expect(result.result.data[0].leadParagraph).to.equal(mockObject.data[0].extra_content);
      expect(result.result.data[0].appCommunity).to.equal(mockObject.data[0].parent_doc_id);
      expect(result.result.data[0].ms).to.equal(mockObject.data[0].created_at);
      expect(result.result.data[0].image).to.equal(mockObject.data[0].image_url);
      expect(result.result.data[0]._doc).to.equal(mockObject.data[0].post_id);
    });
  });

  it('handles missing lead paragraphs', () => {
    const mockObject = require('../mocks/community-map.json');
    const hook = communityMapping();
    const mock = {
      result: { data: [mockObject.data[2]] }
    };
    // send a mock object that does not have lead pragraph
    // verify that the extra_text is undefined.

    return hook(mock).then(result => {
      expect(result.result.data[0]).to.have.ownProperty('extra_content')
        .to.equal(undefined);
    });
  });

  it('transforms ms to s', () => {
    const mockObject = require('../mocks/community-map.json');
    const hook = communityMapping();
    // check if the result is correct
    const mock = {
      result: { data: [mockObject.data[0]] }
    };
    const mockForCreatedAt = moment(mock.result.data[0]._system.created_on.iso_8601).unix() ;

    return hook(mock).then(result => {
      expect(result.result.data[0]).to.have.ownProperty('created_at')
        .to.equal(mockForCreatedAt);
    });
  });
});



