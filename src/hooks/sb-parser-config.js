module.exports = {
  toParse: [
    'body', 
    'leadParagraph'
  ],
  childrenToParse: [],
  images: [
    'image', 
    'highResImage'
  ],
  documents: [],
  dateProperties: [],
  lead: [
    'title', 
    'slug', 
    'leadParagraph', 
    'body',
    'createdOn', 
    'image', 
    'itemImageAlignment', 
    'itemImageBackgroundSize', 
    'imageSize', 
    'video', 
    'imageId', 
    '_system'
  ],
  educationTypes: [],
  scientificTypes: [],
  sci : '',
  edu: '',
  baseUrl: 'https://www.ersnet.org/assets',
  apiUrl: process.env.API_URL,
};