// const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Get Leadership with DOI',
  find: {
    description: 'Returns the Leadership with the corresponding declaration of conflict of interests (DOI). The result needs to be correctly parsed. Ref: https://www.ersnet.org/the-society/who-we-are/leadership <br> There is two properties the **Declartion** and the **sorted**, the first one is the raw data, the second has be reworked to simplify parsing. As a rule of thumb, capitalized properties are **original CRM properties**.<br /> Not all properties are always present. The \'pInterests\' one can contain 4 properties but they are only present if there is data, one of them,  the \'CON\' properties, has an aditional properties \'Area\'', 
    summary: 'Get leadership with DOI', 
    responses: {
      '200': responses.successLeadership,
      '404': responses.notFound
    },
    produces: ['application/json']
  }
};