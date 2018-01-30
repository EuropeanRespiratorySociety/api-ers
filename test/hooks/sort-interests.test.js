const chai = require('chai');
const expect = chai.expect;

const sortInterests = require('../../src/hooks/sort-interests');
const mock = [
  {
    GroupCode: 'EXE',
    TypeCode: 'PP',
    DetailCode: '',
    GroupName: 'Executive committee',
    TypeName: 'Past president',
    DetailName: '',
    StartDate: '01.10.2017',
    EndDate: '30.09.2018',
    IsActive: true,
    Contact: {
      ContactId: 208379,
      Title: 'Prof. Dr.',
      LastName: 'Last Name',
      FirstName: 'First Name',
      SmtpAddress1: 'email@of.someone.com',
      PhotoUrl: 'https://url.somewhere.com'
    },
    Declaration: {
      HasTobaccoConflict: false,
      ConfirmationDate: '03.01.2018',
      Campaign: {
        Title: 'Annual Declaration of Interest 2017-2018',
        StartDate: '13.09.2017',
        EndDate: '18.09.2018',
        IsActive: true
      },
      Interests: [
        {
          SectionCode: 'NOP',
          CompanyName: 'Company Name 1',
          Purpose: 'Grant',
          FundsCode: 'C'
        },
        {
          SectionCode: 'NOP',
          CompanyName: 'Company Name 2',
          Purpose: 'Grant',
          FundsCode: 'C'
        },
        {
          SectionCode: 'NOP',
          CompanyName: 'Company Name 3',
          Purpose: 'Grant',
          FundsCode: 'C'
        },
        {
          SectionCode: 'BEN',
          CompanyName: 'Company Name 4',
          Purpose: 'Speaker\'s fee',
          FundsCode: 'A'
        },
        {
          SectionCode: 'NOP',
          CompanyName: 'Company Name 5',
          Purpose: 'Grant',
          FundsCode: 'C'
        },
        {
          SectionCode: 'OTH',
          CompanyName: 'Company Name 6',
          Purpose: 'Grant',
          FundsCode: 'C'
        }
      ]
    }
  }
];

describe('\'sortInterests\' hook', () => {

  it('runs the hook', async () => {
    const hookMock = {
      result: {
        data: mock
      }
    };

    const hook = sortInterests();
    const result = await hook(hookMock);
    const sorted = result.result.data[0].sorted;
    expect(sorted).to.be.an('object')
      .to.have.property('pInterests')
      .to.be.an('object');
    expect(sorted)
      .to.have.property('npInterests')
      .to.be.an('object');
    expect(sorted)
      .to.have.property('oInterests')
      .to.be.an('object');
    expect(sorted)
      .to.have.property('tobacco')
      .to.be.an('object')
      .to.have.property('title') 
      .to.be.a('string');
  });


  it('runs the hook with tobacco conflict', async () => {
    mock[0].Declaration.HasTobaccoConflict = true;
    const hookMock = {
      result: {
        data: mock
      }
    };

    const hook = sortInterests();
    const result = await hook(hookMock);
    const sorted = result.result.data[0].sorted;

    expect(sorted)
      .to.have.property('tobacco')
      .to.be.an('object')
      .to.have.property('data') 
      .to.be.a('string');
  });

  it('runs the hook with no declaration', async () => {
    delete mock[0].Declaration;
    const hookMock = {
      result: {
        data: mock
      }
    };

    const hook = sortInterests();
    const result = await hook(hookMock);
    const sorted = result.result.data[0].sorted;

    expect(sorted).to.be.an('object')
      .to.have.property('pInterests')
      .to.be.an('object')
      .to.have.property('data')
      .to.be.an('object');
    expect(sorted)
      .to.have.property('npInterests')
      .to.be.an('object')
      .to.have.property('data')
      .to.be.an('array')
      .to.have.a.lengthOf(0);
    expect(sorted)
      .to.have.property('oInterests')
      .to.be.an('object')
      .to.have.property('data')
      .to.be.an('array')
      .to.have.a.lengthOf(0);
    expect(sorted)
      .to.have.property('tobacco')
      .to.be.an('object')
      .to.have.property('title') 
      .to.be.a('string');
  });
});
