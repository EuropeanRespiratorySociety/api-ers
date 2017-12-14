// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { DateUtils, Format } = require('ers-utils');
const format = new Format();
const date = new DateUtils();
const dotenv = require('dotenv');
dotenv.load();

const apiUrl = process.env.API_URL;

module.exports.metadata = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Over writing the result 
    const options = hook.params.options || hook.result._sys;
    const total = hook.result._sys.total;
    const skip = options.skip + options.limit;
    const prev = options.skip - options.limit < 0 ? 0 : options.skip - options.limit;
    const back = options.skip > 0 ? prev : 0;

    const full = hook.params.query.full || false;
    const path = hook.params.path || hook.path;
    const url = apiUrl + '/' + path;

    const queryParams = format.mapModel(hook.params.query, { limit:options.limit}); 
    hook.result.data = addItemMetadata(hook.result.data, full);

    hook.result = hook.result._sys.status === 200 ? format.mapModel(hook.result, {
      _sys: {
        next: url + format.serializeQuery(format.mapModel(queryParams, {skip: skip})),
        prev: url + format.serializeQuery(format.mapModel(queryParams, {skip: back})),
        limit: options.limit,
        skip: options.skip, 
        total: total,
        status: hook.result._sys.status
      },
    }) : hook.result;
    return Promise.resolve(hook);
  };
};

/**
 * Add metadata to full articles
 * @param {Object[]} array
 * @param {boolean} full - display the full article or the lead
 * @return {Object[]}
 */ 
function addItemMetadata(array, full){
  full = full || false;
  return array.map(item => {   
    const created = item._system.created_on;
    const modified = item._system.modified_on;
    item.ms = created.ms;
    item.createdOn = date.ersDate(`${created.month}/${created.day_of_month}/${created.year}`);
    item.modifiedOn = date.ersDate(`${modified.month}/${modified.day_of_month}/${modified.year}`);
    item.shortLead = format.truncate(format.clean(item.leadParagraph), 145);
    if(full){ 
      item.hasRelatedArticles = item._statistics['ers:related-association'] || 0;
      item.hasAuthor = item._statistics['ers:author-association'] || 0;
    }
    return item;
  });
}
