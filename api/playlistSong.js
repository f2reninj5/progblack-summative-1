const Express = require('express');
const database = require('../database');

const song = Express.Router();

// addSong
song.post('/', (request, response) => {
    const body = request.body;
    let playlist;

    if (!body.artist, !body.title) {
        return response.status(400).send({ message: 'Missing artist or title.' });
    }

    try {
        playlist = database.Playlist.addSong(request.user.username, request.playlist.name, {
            artist: body.artist,
            title: body.title
        });
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while adding song.' });
    }

    return response.status(200).json(playlist);
});

// removeSong
song.delete('/:index', (request, response) => {
    let index = request.params.index;
    let playlist;

    try {
        index = parseInt(index);
    }
    catch (error) {
        return response.status(400).send({ message: 'Index must be an integer.' });
    }

    if (request.playlist.songs.length == 0) {
        return response.status(400).send({ message: 'Cannot remove song from empty playlist.' });
    }

    if (request.playlist.songs.length <= index) {
        return response.status(400).send({ message: 'Index is out of range.' });
    }

    try {
        playlist = database.Playlist.removeSong(request.user.username, request.playlist.name, index);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while removing song.' });
    }

    return response.status(200).json(playlist);
});

module.exports = song;
