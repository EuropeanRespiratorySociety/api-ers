module.exports = {
  notFound: {
    description: 'not found - it aslo returns an empty data array ',
    schema: {
      type: 'object',
      properties: {
        data: {type: 'array', items: {}},
        message: {type: 'string'},
        status: {
          type: 'string',
          enum: [404]
        }
      }
    }
  },
  invalidLogin: {
    description: 'Invalid login',
    content: {
      ['application/json']: {
        schema: {
          type: 'object',
          properties:{
            name: {type: 'string'},
            message: {type: 'string'},
            code: {
              type: 'string',
              enum: [401]
            },
            className: {type: 'string'},
            errors: {}
          }
        }
      }
    }
  },
  success: {
    description: 'successful operation',
    schema: {
      type: 'object',
      example: {
        data: [],
        category: [],
        _sys: {
          next: 'string',
          prev: 'string',
          limit: 'int',
          skip: 'int',
          total: 'int',
          status: 'int'
        },
        cache: {
          cached: 'boolean',
          duration: 'int',
          expires_on: 'string',
          parent: 'string',
          group: 'string',
          key: 'string'
        },
      }   
    }
  },
  successProgramme: {
    description: 'successful operation',
    schema: {
      type: 'object',
      example: {
        total: 'int',
        limit: 'int',
        skip: 'int',
        data:[]
      }   
    }
  },
  successProgrammeItem: {
    description: 'successful operation',
    schema: {
      type: 'object',
      example: {
        _id: 'string',
        id: 'int',
        '...': '...'
      }
    }  
  },
  successLeadership: {
    description: 'successful operation',
    schema: {
      type: 'object',
      example: {
        data: [{
          sorted: {
            pInterests: {
              title: '1 - Personal interests',
              data: {
                CON: [],
                BEN: [],
                TRA: [],
                SHA: []
              }
            },
            npInterests: {
              title: '2 - Non-Personal interests',
              data: []
            },
            oInterests: {
              title: '3 - Other Interests that may be seen as potential conflicts',
              data: []
            },
            tobacco: {
              title: '4 - Tobacco-Industry related Conflicts of Interests',
              data: ''
            }
          }
        }],
        cache: {
          cached: 'boolean',
          duration: 'int',
          expires_on: 'string',
          parent: 'string',
          group: 'string',
          key: 'string'
        },
      }   
    }
  },
  successInterests: {
    description: 'successful operation',
    schema: {
      type: 'object',
      example: {
        data: [
          {
            title: 'string',
            values: ['string', 'string'],
            limits: {
              min: 1,
              max: 0
            }
          }
        ],
        cache: {
          cached: 'boolean',
          duration: 'int',
          expires_on: 'string',
          parent: 'string',
          group: 'string',
          key: 'string'
        },
      }   
    }
  },
  successMyCRM: {
    description: 'successful operation',
    schema: {
      type: 'object',
      example: {
        data: [],
        cache: {
          cached: 'boolean',
          duration: 'int',
          expires_on: 'string',
          parent: 'string',
          group: 'string',
          key: 'string'
        },
        status: 'integer',
        accessToken: 'string',
        key4Token: 'string',
        preferences: {}
      }
      
    }
  },
  successCalendar: {
    description: 'successful operation - test',
    schema: {
      type: 'object',
      example:{
        data: [],
        _sys: {
          next: 'string',
          prev: 'string',
          limit: 'int',
          skip: 'int',
          total: 'int',
          status: 'int'
        }
      }
    },
  },
  successMyCRMOneItem: {
    description: 'sucessful operation',
    schema: {
      type: 'object',
      example: {
        data: {},
        status: 200
      }
    }
  },
  successMyCRMLogin: {
    description: 'sucessful operation',
    schema: {
      type: 'object',
      example: {
        data: {},
        status: 200,
        cache: {
          cached: 'boolean',
          duration: 'int',
          expires_on: 'string',
          parent: 'string',
          group: 'string',
          key: 'string'
        },
        preferences: {},
        accessToken: 'string',
        apiUserId: 'string',
        spotmeId: 'string',
        key4Token: 'string',
      }
    }
  },
  successUserCreated: {
    description: 'sucessful operation',
    schema: {
      type: 'object',
      example: {
        email: 'string',
        permissions: 'string',
        _id: 'string'
      }
    }
  }, 
  successPreferencesCreated: {
    description: 'sucessful operation',
    schema: {
      type: 'object',
      properties: {
        layout: {type: 'string'},
        ersId: {type: 'integer'},
        _id: {type: 'string'}
      },
      example: {
        layout: 'feed',
        ersId: 200000,
        _id: '59a9526c5fe1ea1b21dc5e04'
      }

    }
  }, 
  successNoResult: {
    description: 'No result returned for request, but request sucessful',
    schema: {
      type: 'object',
      properties: {
        filters: {type: 'object'},
        _sys: {type: 'object'}
      },
      example: {
        filters: {
          user:[],
          system: []
        },
        _sys: {
          status: 204,
          message: 'No filters available for service: name-of-requested-service'
        }
      }
    }
  },
  conflict: {
    description: 'Conflict when creating the user',
    schema: {
      type: 'object',
      properties:{
        name: {type: 'string'},
        message: {type: 'string'},
        code: {
          type: 'string',
          enum: [409]
        },
        className: {type: 'string'},
        errors: {}
      }
    }
  }
};