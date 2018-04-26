module.exports = {
  toParse: [
    'body', 
    'leadParagraph',
    'references',
    'popUp', 
    'cancellationPolicy', 
    'travelInfo', 
    'technicalInfo'
  ],
  childrenToParse: [
    'venue', 
    'suggestedAccommodation', 
    'ebusVenues', 
    'bursaryApplication'
  ],
  images: [
    'image', 
    'highResImage', 
    'sponsor', 
    'sponsorsAlliances'
  ],
  documents: [
    'programme', 
    'practicalInfo', 
    'disclosure', 
    'documents', 
    'rulesAndRegulation'
  ],
  dateProperties: [
    'notificationOfResults', 
    'extendedDeadline',
    'earlybirdDeadline', 
    'openingDate', 
    'applicationDeadline', 
    'applicationDeadline2', 
    'deadline'
  ],
  lead: [
    'title', 
    'slug', 
    'leadParagraph', 
    'body',
    'author',
    'type',
    'eventDate',
    'diseases',
    'methods', 
    'eventEndDate', 
    'eventLocation', 
    'nonErsCalendarItem',
    'createdOn', 
    'ersEndorsedEvent', 
    'ersDeadline', 
    'fullyBooked', 
    'image', 
    'itemImageAlignment', 
    'itemImageBackgroundSize',
    'imageSize',
    'highResImage',
    'video', 
    'imageId',
    'externalLink',
    'registerButton',
    'url', 
    'uri',
    'availableOnHomepage',
    'mainNews',
    'membersOnly',
    '_system',
    '_doc'
  ],
  educationTypes: [
    'ERS Course', 
    'ERS Online course', 
    'e-learning', 
    'ERS Skill workshop', 
    'ERS Skills course', 
    'ERS Endorsed activity', 
    'ERS Training programme', 
    'Hands-on'
  ],
  scientificTypes: [
    'Long Term', 
    'Short Term', 
    'Summit', 
    'Research Seminar'
  ],
  sci : 'label-scientific',
  edu: 'label-school',
  baseUrl: process.env.CDN_URL,
  apiUrl: process.env.API_URL,
};