const Express = require('express');
const database = require('../database');

const playlist = Express.Router();

playlist.use('/:name', (request, response, next) => {
    const name = request.params.name;
    const playlist = database.Playlist.find(request.user.username, name);
    if (!playlist) {
        return response.status(404).send({ message: 'No Playlist with this name found.' });
    }
    request.playlist = playlist;
    next();
});

playlist.use('/:name/song', require('./playlistSong'));

// create
playlist.post('/', (request, response) => {
    const body = request.body;
    let playlist;

    if (!body.name) {
        return response.status(400).send({ message: 'Missing playlist name.' });
    }

    try {
        if (database.Playlist.find(request.user.username, body.name)) {
            return response.status(409).send({ message: 'Playlist with this name already exists.' });
        }

        playlist = database.Playlist.create(request.user.username, body.name);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while creating playlist.' });
    }

    return response.status(200).json(playlist);
});

// find
playlist.get('/:name', (request, response) => {
    const playlist = request.playlist;
    return response.status(200).json(playlist);
});

module.exports = playlist;
