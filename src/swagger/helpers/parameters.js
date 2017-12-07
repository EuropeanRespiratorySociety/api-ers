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
  full: {
    name: 'full',
    description: 'Parses the full item or only what is necessary for the preview',
    required: false,
    allowMultiple: false,
    type: 'boolean',
    in: 'query'  
  },
  markdown: {
    name: 'md',
    description: 'If set to true, requires markdown instead of html',
    required: false,
    allowMultiple: false,
    type: 'boolean',
    in: 'query'  
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
      <ul>
        <li>ers - ERS only events</li>
        <li>deadlines - ERS deadlines, a typical deadline is the abstract submission</li>
        <li>endorsed - Events not organised by ERS, but endorsed by ERS</li>
        <li>non-ers - Events that have been approved in our calendar but that are nor endorsed nor ers</li>
        <li>all - ...</li>
      </ul>
    `,
    required: false,
    type: 'string',
    in: 'query',
    enum: ['ers', 'deadline', 'endorsed', 'non-ers', 'all' ]
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