const homeHandler = require('./home');
const catsHandler = require('./cat');
const staticHandler = require('./static-files');

module.exports = [homeHandler, catsHandler, staticHandler];