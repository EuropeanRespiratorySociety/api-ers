const sureThing = promise =>
  promise
    .then(response => ({
      ok: true,
      response
    }))
    .catch(error => ({
      ok: false,
      error: error.response.data
    }));

module.exports = sureThing;