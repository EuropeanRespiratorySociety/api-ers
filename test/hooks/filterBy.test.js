const chai = require('chai');
const { filterByType } = require('../../src/hooks/filterBy');
const moment = require('moment');

const expect = chai.expect;



describe('FilterBy hook', () => {    
  it('leaves only current events', () => {
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false },
        options: { type: 'current'} 
      },
      result: {
        category: [],
        data:[
          {
            title: 'This is a past event',
            leadParagraph: 'this is a lead',
            eventDate: moment().subtract(7,'days').format('MM/DD/YYYY'),
            eventEndDate: moment().subtract(3,'days').format('MM/DD/YYYY'),
            startDateTimestamp: moment().subtract(7,'days').unix()
          },
          {
            title: 'This is an event in the future',
            leadParagraph: 'this is a lead',
            eventDate: moment().add(7,'days').format('MM/DD/YYYY'),
            startDateTimestamp: moment().add(7,'days').unix()
          },
          {
            title: 'This is an other event in the future',
            leadParagraph: 'this is a lead',
            eventDate: moment().add(14,'days').format('MM/DD/YYYY'),
            startDateTimestamp: moment().add(14,'days').unix()
          }
        ],
        _sys:{
          status:200
        }    
      }
    }; 
    const hook = filterByType();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data.data).to.have.lengthOf(2);  
      expect(data.data[0]).to.have.property('title')
        .to.equal('This is an event in the future');   
      expect(data.data[1]).to.have.property('title')
        .to.equal('This is an other event in the future');    
    });
  }); 
  
  it('leaves only past events', () => { 
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false },
        options: { type: 'past'} 
      },
      result: {
        category: [],
        data:[
          {
            title: 'This is a past event',
            leadParagraph: 'this is a lead',
            eventDate: moment().subtract(7,'days').format('MM/DD/YYYY'),
            startDateTimestamp: moment().subtract(7,'days').unix()
          },
          {
            title: 'This is an event in the future',
            leadParagraph: 'this is a lead',
            eventDate: moment().add(7,'days').format('MM/DD/YYYY'),
            startDateTimestamp: moment().add(7,'days').unix()
          },
          { 
            title: 'This is an other event in the future',
            leadParagraph: 'this is a lead',
            eventDate: moment().add(14,'days').format('MM/DD/YYYY'),
            startDateTimestamp: moment().add(14,'days').unix()
          }
        ],
        _sys:{
          status:200
        }
      }
    }; 

    const hook = filterByType();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data.data).to.have.lengthOf(1);  
      expect(data.data[0]).to.have.property('title')
        .to.equal('This is a past event');
    });
  });
  
  it('leaves an event with a start date that is passed, but then end date is ongoing', () => { 
    const mock = {
      params : { 
        query: { qname: 'o:44336af7b5e85068c857', full: false },
        options: { type: 'current'} 
      },
      result: {
        category: [],
        data:[
          {
            title: 'This is a past event',
            leadParagraph: 'this is a lead',
            eventDate: moment().subtract(7,'days').format('MM/DD/YYYY'),
            eventEndDate: moment().subtract(3,'days').format('MM/DD/YYYY'),
            startDateTimestamp: moment().subtract(7,'days').unix()
          },
          {
            title: 'This an in between event',
            leadParagraph: 'this is a lead',
            eventDate: moment().subtract(3,'days').format('MM/DD/YYYY'),
            eventEndDate: moment().add(3,'days').format('MM/DD/YYYY'),
            startDateTimestamp: moment().subtract(3,'days').unix()
          }
        ],
        _sys:{
          status:200
        }
      }
    }; 

    const hook = filterByType();
    return hook(mock).then(result =>{
      const data = result.result;
      expect(data._sys.status).to.equal(200);
      expect(data.data).to.have.lengthOf(1);  
      expect(data.data[0]).to.have.property('title')
        .to.equal('This an in between event');
    });
  });
});
