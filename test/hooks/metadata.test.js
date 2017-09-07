const chai = require('chai');
const meta = require('../../src/hooks/metadata');

const expect = chai.expect;


describe('Metada hook', () => {    
  it('adds a system property', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false },
        options: { metadata: true, limit: 25, skip: 0, sort: {} } 
      },
      result: {
        category: [],
        data:[
          {
            title: 'This is a title',
            leadParagraph: 'this is a lead',
            _system:{
              created_on:{
                ms:123456789,
                month:3,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:3,
                day_of_month:10,
                year:2017,
              }
            }
          }
        ],
        _sys:{
          status:200
        }    
      }
    }; 
    const hook = meta.metadata();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data).to.have.nested.property('data[0]')
        .that.is.an('object')          
        .with.property('title')
        .that.equals('This is a title');
      expect(data).to.have.a.property('category')
        .that.is.an('array');
      expect(data).to.have.a.property('_sys')
        .that.is.an('object')
        .with.property('status')
        .to.equal(200);    
    });
  });

  it('adds a system shortLead property', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false },
        options: { metadata: true, limit: 25, skip: 0, sort: {} } 
      },
      result: {
        category: [],
        data:[
          {
            title: 'This is a title',
            leadParagraph: 'this is a lead',
            _system:{
              created_on:{
                ms:123456789,
                month:3,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:3,
                day_of_month:10,
                year:2017,
              }
            }
          }
        ],
        _sys:{
          status:200
        }    
      }
    };
    const hook = meta.metadata();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data).to.have.nested.property('data[0]')
        .that.is.an('object')
        .with.property('shortLead')
        .that.equals('this is a lead');

    });
  });

  it('adds a createdOn property', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false },
        options: { metadata: true, limit: 25, skip: 0, sort: {} } 
      },
      result: {
        category: [],
        data:[
          {
            title: 'This is a title',
            leadParagraph: 'this is a lead',
            _system:{
              created_on:{
                ms:123456789,
                month:3,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:3,
                day_of_month:10,
                year:2017,
              }
            }
          }
        ],
        _sys:{
          status:200
        }    
      }
    };
    const hook = meta.metadata();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data).to.have.nested.property('data[0]')
        .that.is.an('object')
        .with.property('createdOn')
        .that.equals('10 March, 2017');
    }); 
  });

  it('adds pagination', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false },
        options: { metadata: true, limit: 5, skip: 5, sort: {} } 
      },
      result: {
        category: [],
        data:[
          {
            title: 'This is a title',
            leadParagraph: 'this is a lead',
            _system:{
              created_on:{
                ms:123456789,
                month:3,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:3,
                day_of_month:10,
                year:2017,
              }
            }
          }
        ],
        _sys:{
          status:200,
          total:5
        }    
      }
    };
    const hook = meta.metadata();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data._sys).that.is.an('object')          
        .with.property('next')
        .that.is.a('string')
        .to.contain('limit=5&skip=10');
      expect(data._sys).that.is.an('object')          
        .with.property('prev')
        .that.is.a('string')
        .to.contain('limit=5&skip=0');

    });
  });

});
