const Express = require('express');
const database = require('./sources/database');

const user = Express.Router();

user.use('/:username', async (request, response, next) => {
    const username = request.params.username;
    let user;

    try {
        user = await database.User.find(username);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while finding user.' });
    }

    if (!user) {
        return response.status(404).send({ message: 'No user with this username found.' });
    }

    request.user = user;
    next();
});

user.use('/:username/playlist', require('./user.playlist'));

// create
user.post('/', async (request, response) => {
    const body = request.body;
    let user;

    if (!body.username || !body.profileColour) {
        return response.status(400).send({ message: 'Missing username or profileColour.' });
    }

    if (!(/^#[a-fA-F0-9]{6}$/.test(body.profileColour))) {
        return response.status(400).send({ message: 'profileColour must be in hexadecimal format `#abcdef`.' });
    }

    try {
        if (await database.User.find(body.username)) {
            return response.status(409).send({ message: 'User with this username already exists.' });
        }

        user = await database.User.create(body.username, { profileColour: body.profileColour.toLowerCase() });
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

// delete
user.delete('/:username', async (request, response) => {
    try {
        await database.User.delete(request.user.username);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while deleting user.' });
    }

    return response.status(200).send({ message: 'Deleted user.' });
});

module.exports = user;
