const Express = require('express');
const database = require('./sources/database');

const song = Express.Router();

// addSong
song.post('/', async (request, response) => {
    const body = request.body;
    let playlist;

    if (!body.artist, !body.title) {
        return response.status(400).send({ message: 'Missing artist or title.' });
    }

    try {
        playlist = await database.Playlist.addSong(request.user.username, request.playlist.name, {
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
song.delete('/:index', async (request, response) => {
    let index = parseInt(request.params.index);
    let playlist;

    if (isNaN(index)) {
        return response.status(400).send({ message: 'Index must be an integer.' });
    }

    if (request.playlist.songs.length == 0) {
        return response.status(400).send({ message: 'Cannot remove song from empty playlist.' });
    }

    if (index >= request.playlist.songs.length || index < 0) {
        return response.status(400).send({ message: 'Index is out of range.' });
    }

    try {
        playlist = await database.Playlist.removeSong(request.user.username, request.playlist.name, index);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while removing song.' });
    }

    return response.status(200).json(playlist);
});

module.exports = song;
