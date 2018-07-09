// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    const m = hook.result.data.map(i => {
      return {
        content: i.title,
        fp_status: 'approved',
        parent_doc_id: i.appCommunity,
        extra_content: i.leadParagraph ? i.leadParagraph : undefined,
        // order: undefined,
        created_at: i.ms,
        image_url: i.image,
        post_id: i._doc
      };
    });
    hook.result.data = m;
    return Promise.resolve(hook);
  };
};
