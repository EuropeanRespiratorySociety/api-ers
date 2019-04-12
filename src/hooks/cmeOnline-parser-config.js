module.exports = {
  toParse: [
    'leadParagraph',
    'description',
    'references'
  ],
  toParseRecursively: ['cmeOnlineModule'],
  childrenToParse: [
    'tabs',
    'question'
  ],
  images: [
    'image',
    'cmeOrganisers',
    'cmeOnlineModule',
    'tabs',
    'question'
  ],
  documents: [],
  dateProperties: [],
  lead: [
    'title',
    'slug',
    'leadParagraph',
    'cmeType',
    'cmeCategories',
    'cmeOrganisers',
    'diseases',
    'methods',
    'createdOn',
    'image',
    'imageDescription',
    'url',
    'uri',
    '_system',
    '_doc'
  ],
  educationTypes: [],
  scientificTypes: [],
  sci: '',
  edu: '',
  baseUrl: process.env.CDN_URL,
  apiUrl: process.env.API_URL
};
