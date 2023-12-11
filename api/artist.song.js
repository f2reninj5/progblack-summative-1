const Express = require('express');
const { Song } = require('./sources/LastFM');

const song = Express.Router();

song.get('/:title', async (request, response) => {
    const title = request.params.title;
    let song;

    try {
        song = await Song.get(title, request.artist.name);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal server error while finding song.' });
    }

    if (!song) {
        return response.status(404).send({ message: 'No song with this name found.' });
    }

    return response.status(200).json(song);
});

module.exports = song;
