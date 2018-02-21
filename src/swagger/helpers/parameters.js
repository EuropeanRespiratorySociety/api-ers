module.exports = {
  qname: {
    name: 'qname',
    description: 'qname or _qname or the node',
    required: true,
    type: 'string',
    allowMultiple: false,
    in: 'query'
  },
  pattern: {
    name: 'pattern',
    description: 'search pattern',
    required: true,
    type: 'string',
    allowMultiple: false,
    in: 'query'
  },
  id: {
    name: 'contactid',
    description: 'The id of the contact',
    required: true,
    type: 'integer',
    allowMultiple: false,
    in: 'query'
  },
  contactId: {
    name: 'contactid',
    description: 'The id of the contact',
    required: true,
    type: 'integer',
    allowMultiple: false,
    in: 'path'
  },
  limit: {
    name: 'limit',
    description: 'the amount of items to return - max 100',
    required: false,
    allowMultiple: false,
    type: 'integer',
    in: 'query'
  },
  skip: {
    name: 'skip',
    description: 'the amount of items to skip (offset)',
    required: false,
    allowMultiple: false,
    type: 'integer',
    in: 'query'
  },
  slug: {
    name: 'slug',
    description: 'the slug or alias that identifies a ressource',
    required: true,
    allowMultiple: false,
    type: 'string',
    in: 'path'
  },
  endpoint: {
    name: 'endpoint',
    description: 'the name of the endpoint: e.g. \'courses\'',
    required: true,
    allowMultiple: false,
    type: 'string',
    in: 'path'
  },
  sortBy: {
    name: 'sortBy',
    description: 'The CMS\'s property to sort by example: \'_system.created_on.ms\' or \'_system.modified_on.ms\' ',
    required: false,
    allowMultiple: false,
    type: 'string',
    in: 'query'
  },
  direction: {
    name: 'sortDirection',
    description: 'sorting direction (1 = asc, -1 = desc)',
    required: false,
    allowMultiple: false,
    type: 'integer',
    in: 'query',
    enum:[1, -1]
  },
  full: {
    name: 'full',
    description: 'Parses the full item or only what is necessary for the preview',
    required: false,
    allowMultiple: false,
    type: 'boolean',
    in: 'query'  
  },
  format: {
    name: 'format',
    description: `Set the type of textual content that can be formated in the CMS. Default is set to 'html': <ul>
    <li>html</li>
    <li>raw</li>
    <li>markdown</li>
    </ul>`,
    required: false,
    allowMultiple: false,
    type: 'string',
    in: 'query',
    enum: ['html', 'markdown', 'raw']
  },
  timeline: {
    name: 'timeline',
    description: `If set to true, returned item will be grouped by year then by month for easy timeline display. the retruned structure is different: <br /> <pre><code>
      { 
        '2018': 
          {
            mars:[],
            april:[]
          },
        '2019': {}  
      }
      </code></pre>`,
    required: false,
    allowMultiple: false,
    type: 'boolean',
    in: 'query'  
  },
  reverse: {
    name: 'reverse',
    description: 'If set to true, the order will be reversed',
    required: false,
    allowMultiple: false,
    type: 'boolean',
    in: 'query'  
  },
  object: {
    name: 'object',
    description: 'The object sent to cloudcms',
    required: true,
    schema: {
      properties: {
      },
      example:{
        tile: 'new title',
        url: 'new url'
      },
      type: 'object'
    },
    in: 'body'
  },
  eventType: {
    name: 'type',
    description: `The type of event returned by the calendar, __ers__ is the default and is not necessary in the query string
      * ers - ERS only events
      * deadlines - ERS deadlines, a typical deadline is the abstract submission
      * endorsed - Events not organised by ERS, but endorsed by ERS
      * non-ers - Events that have been approved in our calendar but that are nor endorsed nor ers
      * spirometry - Spirometry Training Programme - These events appear under ERS as they are ERS events, but they can also appear by their own on some pages
      * hermes - HERMES pages - These events appear under ERS as they are ERS events, but they can also appear by their own on some pages
      * all - ...
    `,
    required: false,
    type: 'string',
    in: 'query',
    enum: ['ers', 'deadline', 'endorsed', 'non-ers', 'spirometry', 'all' ]
  },
  coursesType: {
    name: 'type',
    description: `Filters courses. 
     * 'all' returns... all published courses
     * 'past' returns courses that are already passed but still published`,
    required: false,
    in: 'query',
    type: 'string',
    enum: ['past', 'all']
  },
  contentModel: {
    name: 'type',
    description: `type of content (content model). 
    * 'ers:article' content of the ERS (news, courses, vision, etc...)
    * 'sb:article' content of the Sleep and breathing conference`,
    required: true,
    in: 'query',
    type: 'string',
    enum: ['ers:article', 'sb:article']
  },
  user: {
    name: 'object',
    description: 'The user to create',
    required: true,
    schema: {
      properties: {},
      example:{
        email: 'user email',
        password: 'user password',
        permissions: 'the permission the user is granted'
      },
      type: 'object'
    },
    in: 'body'
  },
  preferences: {
    name: 'object',
    description: 'The preference ogject to create',
    required: true,
    schema: {
      properties: {
        ersId: {type: 'integer'},
        spotmeId: {type: 'string'},
        _id: {type: 'string'},
        layout: {type: 'string'},
        notifications: [],
        interests: []
      },
      example:{
        ersId: 'integer',
        spotMe: 'string',
        layout: 'string',
        notifications: [],
        interests:[]
      },
      type: 'object'
    },
    in: 'body'
  }

};