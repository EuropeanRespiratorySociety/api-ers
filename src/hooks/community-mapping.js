// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const moment = require('moment');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    const m = hook.result.data.map(i => {
      const { apiPath = false } = i.category || {};
      const extra_content = [
        i.leadParagraph ? i.leadParagraph : '',
        generateHashtags(i.diseases).join(' '),
        generateHashtags(i.methods).join(' ')
      ].reduce((a, c) => {
        if (c.length > 0) a = a + ' ' + c;
        return a;
      }, '');

      return {
        content: i.title,
        fp_status: i.communityPostStatus || 'approved',
        parent_doc_id: i.appCommunity,
        extra_content,
        // order: undefined,
        created_at: moment(i._system.created_on.iso_8601).unix(),
        image_url: i.image,
        post_id: i._doc,
        related_post: {
          endpoint: apiPath ? apiPath.split('/')[1] : '',
          apiPath: apiPath ? apiPath : '',
          slug: i.slug
        }
      };
    });
    hook.result.data = m;
    return Promise.resolve(hook);
  };
};

function generateHashtags(array) {
  return array.map(i => `#${i.split(' ').map(s => s.replace(/\w/, f => f.toUpperCase())).join('')}`);
}