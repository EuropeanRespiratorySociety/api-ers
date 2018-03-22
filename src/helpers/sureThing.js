const sureThing = promise =>
  promise
    .then(response => ({
      ok: true,
      response
    }))
    .catch(error => ({
      ok: false,
      error
    }));

module.exports = sureThing;