const Express = require('express');
const database = require('./sources/database');

const playlist = Express.Router();

playlist.use('/:name', async (request, response, next) => {
    const name = request.params.name;
    let playlist;

    try {
        playlist = await database.Playlist.find(request.user.username, name);
    }
    catch (error) {
        return response.status(500).send({ message: 'Internal server error while finding playlist.' });
    }

    if (!playlist) {
        return response.status(404).send({ message: 'No playlist with this name found.' });
    }

    request.playlist = playlist;
    next();
});

playlist.use('/:name/song', require('./user.playlist.song'));

// create
playlist.post('/', async (request, response) => {
    const body = request.body;
    let playlist;

    if (!body.name) {
        return response.status(400).send({ message: 'Missing playlist name.' });
    }

    try {
        if (await database.Playlist.find(request.user.username, body.name)) {
            return response.status(409).send({ message: 'Playlist with this name already exists.' });
        }

        playlist = await database.Playlist.create(request.user.username, body.name);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while creating playlist.' });
    }

    return response.status(200).json(playlist);
});

// find
playlist.get('/:name', async (request, response) => {
    const playlist = request.playlist;
    return response.status(200).json(playlist);
});

// delete
playlist.delete('/:name', async (request, response) => {
    try {
        await database.Playlist.delete(request.user.username, request.playlist.name);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while deleting user.' });
    }

    return response.status(200).send({ message: 'Deleted playlist.' });
});

module.exports = playlist;
