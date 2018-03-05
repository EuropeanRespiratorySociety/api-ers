const cc = require('./cloudcms');
const feathers = require('./feathers');

cc();
process.on('Cloud CMS connected', () => {
  feathers();
});



