// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const sureThing = require('../helpers/sureThing');
const { HTTP } = require('../helpers/HTTP');

/* eslint-disable no-console */
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async function (hook) {
    const { crmToken, crmInterests, user } = hook.params;
    const { interests } = hook.data;
    const crmClient = HTTP('https://crmapi.ersnet.org', crmToken);

    const diseases = interests.reduce((a, i) => {
      const { DiseaseId = false } = crmInterests.diseases.filter(ii => i === ii.Name)[0] || false;
      if (DiseaseId) a.push({ DiseaseId });
      return a;
    }, []);

    const methods = interests.reduce((a, i) => {
      const { MethodId = false } = crmInterests.methods.filter(ii => i === ii.Name)[0] || false;
      if (MethodId) a.push({ MethodId });
      return a;
    }, []);

    const [d, m] = await Promise.all([
      sureThing(crmClient.put(`/contacts/${user.ersId}/diseases`, diseases)),
      sureThing(crmClient.put(`/contacts/${user.ersId}/methods`, methods)),
    ]);

    if (d.ok && m.ok) return Promise.resolve(hook);
    if (!d.ok || !m.ok) {
      console.log(`CRM sync failed: disease error: ${d.error}, method.error: ${m.error}`);
      // We continue as we want to save the data locally nevertheless will sync another time.
      return Promise.resolve(hook);
    }

  };
};
