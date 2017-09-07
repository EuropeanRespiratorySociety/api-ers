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
    description: 'The type of event',
    required: false,
    type: 'string',
    in: 'query',
    enum: ['deadline', 'endorsed', 'non-ers', 'all' ]
  },
  user: {
    name: 'object',
    description: 'The user to create',
    required: true,
    schema: {
      properties: {
      },
      example:{
        email: 'user email',
        password: 'user password',
        permissions: 'the permission the user is granted'
      },
      type: 'object'
    },
    in: 'body'
  },

};