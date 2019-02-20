module.exports = {
  toParse: [
    'leadParagraph',
  ],
  childrenToParse: [],
  images: [],
  documents: [],
  dateProperties: [],
  lead: [
    'title',
    'slug',
    'author',
    'journal',
    'journalLink',
    'leadParagraph',
    'digestType',
    'digestAuthor',
    '_system'
  ],
  educationTypes: [],
  scientificTypes: [],
  sci: '',
  edu: '',
  baseUrl: process.env.CDN_URL,
  apiUrl: process.env.API_URL,
};
