module.exports = {
  toParse: [
    'body', 
    'leadParagraph', 
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
    'eventEndDate', 
    'nonErsCalendarItem',
    'createdOn', 
    'ersEndorsedEvent', 
    'ersDeadline', 
    'fullyBooked', 
    'image', 
    'itemImageAlignment', 
    'itemImageBackgroundSize',
    'imageSize', 
    'video', 
    'imageId',
    'externalLink', 
    'url', 
    'uri',
    '_system'
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
  baseUrl: 'https://www.ersnet.org/assets',
  apiUrl: process.env.API_URL,
};