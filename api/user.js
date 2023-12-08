const Express = require('express');
const user = Express.user();

user.get('/:username', (request, response) => {

});

module.exports = user;
