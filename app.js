const Express = require('express');
const bodyParser = require('body-parser');

const app = new Express();

app.use(bodyParser.json());
app.use(Express.static('public'));
app.use('/user', require('./api/user'));

module.exports = app;
