const Express = require('express');
const database = require('../database');

const user = Express.Router();

user.use('/:username', (request, response, next) => {
    const username = request.params.username;
    let user;
    try {
        user = database.User.find(username);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while finding user.' });
    }
    if (!user) {
        return response.status(404).send({ message: 'No User with this username found.' });
    }
    request.user = user;
    next();
});

user.use('/:username/playlist', require('./playlist'));

// create
user.post('/', (request, response) => {
    const body = request.body;
    let user;

    if (!body.username) {
        return response.status(400).send({ message: 'Missing username.' });
    }

    try {
        if (database.User.find(body.username)) {
            return response.status(409).send({ message: 'User with this username already exists.' });
        }

        user = database.User.create(body.username);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while creating user.' });
    }

    return response.status(200).json(user);
});

// find
user.get('/:username', (request, response) => {
    return response.status(200).json(request.user);
});

module.exports = user;
