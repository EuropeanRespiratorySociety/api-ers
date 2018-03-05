const chai = require('chai');
const meta = require('../../src/hooks/metadata');

const expect = chai.expect;

// IMPORTANT - remember date month are coming from java...
// January is? 0 not 1


describe('Metada hook', () => {
  it('handles a 404', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false },
        options: { metadata: true, limit: 25, skip: 0, sort: {} } 
      },
      result: {
        category: [],
        data:[],
        _sys:{
          status:404
        }    
      }
    }; 
    const hook = meta.metadata();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(404);
      expect(data).to.have.a.property('category')
        .that.is.an('array');
      expect(data).to.have.a.property('_sys')
        .that.is.an('object')
        .with.property('status')
        .to.equal(404);    
    });
  });

  it('handles a missing options object', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false }
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
                month:2,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:2,
                day_of_month:10,
                year:2017,
              }
            }
          }
        ],
        _sys:{
          status: 200
        }    
      }
    }; 
    const hook = meta.metadata();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data).to.have.a.property('category')
        .that.is.an('array');
      expect(data).to.have.a.property('_sys')
        .that.is.an('object')
        .with.property('status')
        .to.equal(200);    
    });
  });

  it('handles a non existing full param', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857' },
        options: {} 
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
                month:2,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:2,
                day_of_month:10,
                year:2017,
              }
            }
          }
        ],
        _sys:{
          status: 200
        }    
      }
    }; 
    const hook = meta.metadata();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data).to.have.a.property('category')
        .that.is.an('array');
      expect(data).to.have.a.property('_sys')
        .that.is.an('object')
        .with.property('status')
        .to.equal(200);    
    });
  });

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
                month:2,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:2,
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
                month:2,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:2,
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
                month:2,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:2,
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
                month:2,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:2,
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


  it('returns full item', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: true },
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
                month:2,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:2,
                day_of_month:10,
                year:2017,
              }
            },
            _statistics: {}
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
      expect(data.data[0].hasRelatedArticles).to.equal(0);
      expect(data.data[0].hasAuthor).to.equal(0);

    });
  }); 
  
  
  it('returns full item', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: true },
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
                month:2,
                day_of_month:10,
                year:2017,
              },
              modified_on:{
                ms:123456789,
                month:2,
                day_of_month:10,
                year:2017,
              }
            },
            _statistics: {
              'ers:related-association': 3,
              'ers:author-association': 4
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
      expect(data.data[0].hasRelatedArticles).to.equal(3);
      expect(data.data[0].hasAuthor).to.equal(4);

    });
  });  

});
