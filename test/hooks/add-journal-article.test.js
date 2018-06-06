const assert = require('assert');
const { oneArticle, manyArticle } = require('../../src/hooks/add-journal-article');

const chai = require('chai');
const expect = chai.expect;

const failMock = {
  result: {
    data: {
      doi: 'does-not-exist-123456'
    }
  },
  app: {
    service (which) {
      if(which === 'journals')
        return {
          find (params) {
            if (params.query.doi === 'does-not-exist-123456') {
              return {
                total: 0,
                limit: 25,
                skip: 0,
                data: []
              };
            }
          }
        };
    }
  }
};  

describe('\'addJournalArticle\' hook', () => {
  it('runs the oneArticle hook', () => {
    const mock = {
      result: {
        data: {
          doi: '10.1183/20734735.008617',
          body: false
        }
      },
      app: {
        service (which) {
          if(which === 'journals') {
            return {
              find (params) {
                if (params.query.doi === '10.1183/20734735.008617') {
                  return article;
                }
              }
            };
          }
    
          return {
            total: 0,
            limit: 25,
            skip: 0,
            data: []
          };
        }
      }
    };
    
    const hook = oneArticle();
    return hook(mock).then(result => {
      expect(result.result).to.be.an('object')
        .to.haveOwnProperty('data')
        .to.be.an('object')
        .to.haveOwnProperty('doi')
        .to.equal('10.1183/20734735.008617');
    });
  });

  it('it skips an already cached article', () => {
    const mock = {
      result: {
        data: {
          doi: '10.1183/20734735.008617',
          body: false
        },
        cache: {cached: true}
      },
      app: {
        service (which) {
          if(which === 'journals') {
            return {
              find (params) {
                if (params.query.doi === '10.1183/20734735.008617') {
                  return article;
                }
              }
            };
          }
    
          return {
            total: 0,
            limit: 25,
            skip: 0,
            data: []
          };
        }
      }
    };

    mock.result.cache = {cached: true};
    const hook = oneArticle();
    return hook(mock).then(r => {
      const body = r.result.data.body;
      expect(body).to.not.be.ok;
    });
  });

  it('it adds the content of the abstract to the empty body', () => {
    const mock = {
      result: {
        data: {
          doi: '10.1183/20734735.008617',
          body: false
        }
      },
      app: {
        service (which) {
          if(which === 'journals') {
            return {
              find (params) {
                if (params.query.doi === '10.1183/20734735.008617') {
                  return article;
                }
              }
            };
          }
    
          return {
            total: 0,
            limit: 25,
            skip: 0,
            data: []
          };
        }
      }
    };
    const hook = oneArticle();
    return hook(mock).then(r => {
      const body = r.result.data.body;
      expect(body).to.be.a('string')
        .to.not.have.string('<br />');
      expect(body).to.have.string('This issue is dedicated to technological');
    });
  });

  it('it adds the content of the abstract to the body that already has text', () => {
    const mock = {
      result: {
        data: {
          doi: '10.1183/20734735.008617',
          body: 'test body'
        }
      },
      app: {
        service (which) {
          if(which === 'journals') {
            return {
              find (params) {
                if (params.query.doi === '10.1183/20734735.008617') {
                  return article;
                }
              }
            };
          }
    
          return {
            total: 0,
            limit: 25,
            skip: 0,
            data: []
          };
        }
      }
    };

    const hook = oneArticle();
    return hook(mock).then(r => {
      const {body, title} = r.result.data;
      expect(body).to.be.a('string')
        .to.have.string('<br />');
      expect(title).to.be.a('string')
        .to.equal('Breathe: biomedical engineering in respiratory disorders');
      expect(body).to.have.string('This issue is dedicated to technological');
      expect(body).to.have.string('test body');
    });
  });

  it('it returns an error when no article is found', () => {
    const mock = failMock;
    const hook = oneArticle();
    return hook(mock).catch(result => {
      expect(result.code).to.equal(404);
      expect(result.message).to.equal('The DOI did not return any article from any of the ERS journals');
    });
  });

});

describe('\'addJournalArticle\' hook', () => { 

  it('runs the manyArticle hook', () => {
    // A mock hook object
    const mock = {
      result: {
        data: []
      }
    };
    // Initialize our hook with no options
    const hook = manyArticle(); 
    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });  

  it('adds journal content if DOI is present', () => {
    // A mock hook object
    const mock = {
      result: {
        data: appHighligths.data
      },
      app: {
        service (which) {
          if(which === 'journals') {
            return {
              find (params) {
                if (params.query.doi === '10.1183/20734735.008617') {
                  return article;
                }
              }
            };
          }
    
          return {
            total: 0,
            limit: 25,
            skip: 0,
            data: []
          };
        }
      }
    };
    // Initialize our hook with no options
    const hook = manyArticle(); 
    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      const data = result.result.data;
      expect(data).to.be.an('array')
        .to.have.lengthOf(4);
      expect(data[0]).to.be.an('object')
        .to.haveOwnProperty('doi');
      expect(data[0]).to.be.an('object')
        .to.haveOwnProperty('body')
        .to.have.string('This issue is dedicated to technological');
      expect(data[0]).to.haveOwnProperty('title')
        .to.equal('Breathe: biomedical engineering in respiratory disorders');
      expect(data[1]).to.be.an('object')
        .not.to.haveOwnProperty('doi');
      expect(data[1]).to.be.an('object')
        .to.haveOwnProperty('body')
        .to.equal('<p>We will welcome moderator Vivienne Parry OBE, writer and broadcaster, alongside our panel of experts to facilitate a lively and interactive discussion with the audience on the topic of education in respiratory medicine.</p>\n<p>Participation in this session is free.</p>\n<ul>\n<li><a href="https://erscongress.org/programme-2018/educational-programme/educational-forum.html">Learn more</a></li>\n<li><a href="https://erscongress.org/registration-2018/registration-fees.html">Register for Congress by 10 July for an early-bird discount</a></li>\n</ul>\n');
      expect(data[2].body).to.be.a('string')
        .to.have.string('This issue is dedicated to technological');
      expect(data[2].body).to.not.have.string('<br />');
    });
  });  

  it('Adds message when DOI is not found', () => {
    const mock = {
      result: {
        data: [
          { 
            title: 'DOI not found',
            slug: 'doi-not-found',
            type: 'News',
            leadParagraph:'<p>The Educational Forum will return to this year’s ERS Congress with an engaging new format. </p>\n',
            shortLead:'The Educational Forum will return to this year’s ERS Congress with an engaging new format. \n',
            body: false,
            doi: 'will-not-be-found'
          },
          { 
            title: 'DOI not found 2',
            slug: 'doi-not-found',
            type: 'News',
            leadParagraph:'<p>The Educational Forum will return to this year’s ERS Congress with an engaging new format. </p>\n',
            shortLead:'The Educational Forum will return to this year’s ERS Congress with an engaging new format. \n',
            body: 'this is a text',
            doi: 'will-not-be-found-2'
          }
        ]
      },
      app: {
        service (which) {
          if(which === 'journals') {
            return {
              find (params) {
                if (params.query.doi === '10.1183/20734735.008617') {
                  return article;
                }

                return {
                  total: 0,
                  limit: 25,
                  skip: 0,
                  data: []
                };
              }
            };
          }

          return {
            total: 0,
            limit: 25,
            skip: 0,
            data: []
          };
        }
      }
    };
    // Initialize our hook with no options
    const hook = manyArticle(); 
    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      const data = result.result.data;
      expect(data).to.be.an('array')
        .to.have.lengthOf(2);
      expect(data[0].body).to.be.a('string')
        .to.have.string('The DOI did not return any article from any of the ERS journals');
      expect(data[0].body).to.not.have.string('<br />');
      expect(data[1].body).to.be.a('string')
        .to.have.string('this is a text');
      expect(data[1].body).to.have.string('<br />');
    });
  });

  it('Does not touch cached objects', () => {
    const mock = {
      result: {
        cache: {cached: true},
        data: [
          { 
            title: 'DOI not found',
            slug: 'doi-not-found',
            type: 'News',
            leadParagraph:'<p>The Educational Forum will return to this year’s ERS Congress with an engaging new format. </p>\n',
            shortLead:'The Educational Forum will return to this year’s ERS Congress with an engaging new format. \n',
            body: false,
            doi: 'will-not-be-found'
          }
        ]
      },
      app: {
        service (which) {
          if(which === 'journals') {
            return {
              find (params) {
                if (params.query.doi === '10.1183/20734735.008617') {
                  return article;
                }

                return {
                  total: 0,
                  limit: 25,
                  skip: 0,
                  data: []
                };
              }
            };
          }

          return {
            total: 0,
            limit: 25,
            skip: 0,
            data: []
          };
        }
      }
    };
    // Initialize our hook with no options
    const hook = manyArticle(); 
    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      const data = result.result.data;
      expect(data).to.be.an('array')
        .to.have.lengthOf(1);
      expect(data[0].body).not.to.be.ok;
    });
  });
});

/**
 * This structure is due to the method find that should return only one article
 */
const article = {
  total: 1,
  limit: 25,
  skip: 0,
  data: [
    {
      _id: '5a995a8adc0116036b9e5a74',
      journal_url: 'http://breathe.ersjournals.com',
      access: 'open-access',
      article_pdf_url: 'http://breathe.ersjournals.com/content/13/2/75.full.pdf',
      related_articles: [],
      article_full_url: 'http://breathe.ersjournals.com/content/13/2/75.full',
      article_full_text_url: 'http://breathe.ersjournals.com/content/13/2/75.full',
      keywords: [],
      title: 'Breathe: biomedical engineering in respiratory disorders',
      subjects: [],
      volume: 13,
      references: [
        {
          publication: 'Oxford University Press',
          year: 1996,
          _id: '5a995a8adc0116036b9e5a72'
        }
      ],
      canonical: 'http://breathe.ersjournals.com/content/13/2/75',
      authors_emails: [
        'rlriha@hotmail.com'
      ],
      scrapedOn: '2018-03-02T14:07:06.000Z',
      issue: 2,
      short_abstract: '<p><b>The June issue of <i>Breathe</i> looks at biomedical engineering in respiratory disorders</b>http://ow.ly/rn7N30c2qvg</p>',
      article_type: 'Editorial',
      abstract: 'This issue is dedicated to technological advances and their contribution to the advancement of respiratory medicine. Our understanding of the fundamental aspects of breathing and respiration would not have been possible without simultaneous advances in technology based in the physical, engineering and chemical sciences. From the Lavoisiers to Boyle, the Curies to Röntgen, without the equipment to conduct the necessary experiments, we would have proceeded even more slowly towards our grasp of oxygen, Boyle’s law, the chest radiograph and the fundamental principles of tumour irradiation. As far as respiratory physiology goes, West [1] has eloquently stated that surges in our understanding often occur during times of war, when challenges to human physiology spur on technological innovation. War can also create conditions during which talented individuals set aside their different research interests and collaborate effectively. However, technological advances also occur outwith such an environment and in the last three decades, the digital revolution, the Internet, and a number of key discoveries in the biomechanical and engineering fields have revolutionised our approach to evaluating, diagnosing and managing medical disorders. We hope that you will enjoy reading and learning more about ultrasonography and its application to diagnosing diseases of the pleural space and lungs, technical innovations in noninvasive ventilationand our online exclusive on wearable technology and the Internet of Things.\n\nThe June issue of Breathe looks at biomedical engineering in respiratory disorders <http://ow.ly/rn7N30c2qvg>',
      page_url: 'http://breathe.ersjournals.com/content/13/2/75',
      pisa: 'breathe;13/2/75',
      publisher: 'European Respiratory Society',
      authors_institutions: [
        {
          country: 'UK',
          address: 'Royal Infirmary Edinburgh',
          head: 'Dept of Sleep Medicine',
          raw: 'Dept of Sleep Medicine, Royal Infirmary Edinburgh, Edinburgh, UK',
          city: 'Edinburgh',
          _id: '5a995a8adc0116036b9e5a73'
        }
      ],
      authors: [
        'Renata L. Riha'
      ],
      doi: '10.1183/20734735.008617',
      full_available_text: '<p id=\'p-4\'>This issue is dedicated to technological advances and their contribution to the advancement of respiratory medicine. Our understanding of the fundamental aspects of breathing and respiration would not have been possible without simultaneous advances in technology based in the physical, engineering and chemical sciences. From the Lavoisiers to Boyle, the Curies to Röntgen, without the equipment to conduct the necessary experiments, we would have proceeded even more slowly towards our grasp of oxygen, Boyle’s law, the chest radiograph and the fundamental principles of tumour irradiation. As far as respiratory physiology goes, W<span class=\'sc\'>est</span> [<a id=\'xref-ref-1-1\' class=\'xref-bibr\' href=\'#ref-1\'>1</a>] has eloquently stated that surges in our understanding often occur during times of war, when challenges to human physiology spur on technological innovation. War can also create conditions during which talented individuals set aside their different research interests and collaborate effectively. However, technological advances also occur outwith such an environment and in the last three decades, the digital revolution, the Internet, and a number of key discoveries in the biomechanical and engineering fields have revolutionised our approach to evaluating, diagnosing and managing medical disorders. We hope that you will enjoy reading and learning more about ultrasonography and its application to diagnosing diseases of the pleural space and lungs, technical innovations in noninvasive ventilationand our online exclusive on wearable technology and the Internet of Things.</p><p id=\'p-5\'>Physiology Masterclass will be available as an online exclusive for this issue: please look out for an unique take on the use of tracheal sound in diagnosing upper airway obstruction during sleep.</p><p id=\'p-6\'>We also draw your attention to excellent feature on difficult patient–physician interactions, which I encourage you to read and share. Those of us who have been on both sides of such a conversation will maybe understand the issues even more keenly.</p><p id=\'p-7\'>We update each issue of <em>Breathe</em> with exclusive online content, so please come back to us to read and share this material (<a href=\'http://breathe.ersjournals.com\'>breathe.ersjournals.com</a>), and don’t forget to send in your case reports.</p><p id=\'p-8\'>My thanks, as ever, go to our generous contributors, all members of the editorial office and to you, the readers, who contribute to the journal’s ongoing success. Wishing you warm and sunny days full of interesting reading!</p>',
      createdAt: '2018-03-02T14:07:06.169Z',
      updatedAt: '2018-03-02T14:07:06.169Z',
      __v: 0
    }]
};

const appHighligths = { 
  data: [ 
    { 
      title: 'Test Article with DOI',
      slug: 'test-article-with-doi',
      leadParagraph: false,
      shortLead: 'false',
      body: 'This issue is dedicated to technological advances and their contribution to the advancement of respiratory medicine. Our understanding of the fundamental aspects of breathing and respiration would not have been possible without simultaneous advances in technology based in the physical, engineering and chemical sciences. From the Lavoisiers to Boyle, the Curies to Röntgen, without the equipment to conduct the necessary experiments, we would have proceeded even more slowly towards our grasp of oxygen, Boyle’s law, the chest radiograph and the fundamental principles of tumour irradiation. As far as respiratory physiology goes, West [1] has eloquently stated that surges in our understanding often occur during times of war, when challenges to human physiology spur on technological innovation. War can also create conditions during which talented individuals set aside their different research interests and collaborate effectively. However, technological advances also occur outwith such an environment and in the last three decades, the digital revolution, the Internet, and a number of key discoveries in the biomechanical and engineering fields have revolutionised our approach to evaluating, diagnosing and managing medical disorders. We hope that you will enjoy reading and learning more about ultrasonography and its application to diagnosing diseases of the pleural space and lungs, technical innovations in noninvasive ventilationand our online exclusive on wearable technology and the Internet of Things.\n\nThe June issue of Breathe looks at biomedical engineering in respiratory disorders <http://ow.ly/rn7N30c2qvg>',
      doi: '10.1183/20734735.008617',
    },
    { 
      title: 'New style Educational Forum at ERS 2018',
      slug: 'new-style-educational-forum-at-ers-2018',
      type: 'News',
      leadParagraph: '<p>The Educational Forum will return to this year’s ERS Congress with an engaging new format. </p>\n',
      shortLead:'The Educational Forum will return to this year’s ERS Congress with an engaging new format. \n',
      body:
       '<p>We will welcome moderator Vivienne Parry OBE, writer and broadcaster, alongside our panel of experts to facilitate a lively and interactive discussion with the audience on the topic of education in respiratory medicine.</p>\n<p>Participation in this session is free.</p>\n<ul>\n<li><a href="https://erscongress.org/programme-2018/educational-programme/educational-forum.html">Learn more</a></li>\n<li><a href="https://erscongress.org/registration-2018/registration-fees.html">Register for Congress by 10 July for an early-bird discount</a></li>\n</ul>\n'
    },
    { 
      title: 'New style Educational Forum at ERS 2018',
      slug: 'new-style-educational-forum-at-ers-2018',
      type: 'News',
      leadParagraph: '<p>The Educational Forum will return to this year’s ERS Congress with an engaging new format. </p>\n',
      shortLead:'The Educational Forum will return to this year’s ERS Congress with an engaging new format. \n',
      body: false,
      doi: '10.1183/20734735.008617',
    },
    { 
      title: 'Ban e-cigarette flavourings and misleading adverts to protect youth, says international respiratory group',
      slug: 'ban-e-cigarette-flavourings-and-misleading-adverts-to-protect-youth',
      type: 'News',
      leadParagraph: '<p>In a statement published in the <em>European Respiratory Journal</em>, the Forum of International Respiratory Societies (<a href="https://www.firsnet.org/">FIRS</a>) have warned of the dangers posed to children and adolescents by electronic cigarettes.</p>\n',
      shortLead: 'In a statement published in the European Respiratory Journal, the Forum of International Respiratory Societies (FIRS) have warned of the...',
      body: '<p>As a result, they are calling for an immediate ban on flavourings and on marketing e-cigarettes as lower risk alternatives to children and adolescents.</p>\n<p>The paper brings together a wide range of research findings on e-cigarettes. It highlights evidence that children and adolescents are highly susceptible to nicotine addiction, and that use of e-cigarettes has risen steeply in this age group to become the most commonly used tobacco-related product among adolescents in some countries.</p>\n<p>The authors lay out a set of evidence-based recommendations for protecting youth from nicotine addiction and its harmful effects.</p>\n<p>The paper was co-authored by Thomas Ferkol MD, Alexis Hartmann professor of paediatrics and professor of cell biology and physiology at Washington University in St. Louis, USA. He said: “Until recently, the risks of e-cigarettes and their rising popularity with children and adolescents were under-recognised or ignored. We wrote this statement to address growing public health concerns over e-cigarette use among youths.</p>\n<p>“Product design, flavours, marketing, and perception of safety and acceptability have increased the appeal of e-cigarettes to young people. These products are ‘normalising’ smoking and leading to new generations addicted to nicotine.”</p>\n<p>The authors found growing evidence that e-cigarettes act as a “one-way bridge” to cigarette smoking in adolescents.</p>\n<p>Professor Ferkol added: “Some people truly believe e-cigarettes could be used as a smoking cessation technique, but these products also are an entry to nicotine addiction and tobacco use in young people.”</p>\n<p>Charlotta Pisinger, clinical professor of tobacco control at Bispebjerg and Frederiksberg Hospital and University of Copenhagen, Denmark was also a co-author. She said: “Although exposure to potentially harmful ingredients from electronic cigarettes may be lower than traditional cigarettes, this does not mean that e-cigarettes are harmless.</p>\n<p>“And when we’re talking about children and adolescents who are trying e-cigarettes for the first time, we should not be comparing their use to traditional cigarettes. We should be comparing them to no tobacco use.”</p>\n<p>The paper puts forward a series of expert recommendations that the authors say will protect this vulnerable group. They state that e-cigarettes should be regulated in the same way as tobacco products and included in smoke-free policies. They say that there should be a ban on sales to youths worldwide, which must be enforced. Advertising e-cigarettes as lower-risk alternatives directed to youths and young adults should cease.</p>\n<p>The paper also calls for a ban on flavoured products, because there is evidence that flavourings draw young people to e-cigarettes. There are currently more than 7,500 different flavoured e-cigarettes and refills available. Finally, the authors recommended further research on the health effects of e-cigarettes as well as surveillance of use across different countries.</p>\n<p>Regulation of e-cigarettes varies widely around the world. For example, legislation on a minimum age for buying e-cigarettes is non-existent or not enforced in most countries.</p>\n<p>Dr Aneesa Vanker, a senior specialist in paediatric pulmonology, at the Red Cross War Memorial Children’s Hospital, University of Cape Town, South Africa, was also a co-author the paper. She added: “E-cigarettes are largely unregulated, particularly in low and middle-income countries. They are marketed as a smoking cessation tool and a safer alternative to tobacco cigarettes.</p>\n<p>“However, there is growing evidence that nicotine has many acute and long-term adverse effects, including addiction. Young people are at particular risk for this. </p>\n<p>“We want local, national, and regional decision-makers to recognise the growing public health threat that e-cigarettes pose to children and adolescents. Inhaling something other than air is never good for a child’s lungs.”</p>\n<ul>\n<li><a href="http://erj.ersjournals.com/content/51/5/1800278">Read the article</a> </li>\n</ul>\n'
    } 
  ]
};
