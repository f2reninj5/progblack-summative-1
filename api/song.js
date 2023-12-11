const Express = require('express');
const { Song } = require('./sources/LastFM');

const song = Express.Router();

song.get('/:title', async (request, response) => {
    const title = request.params.title;
    let song;

    try {
        song = await Song.findAll(title);
    }
    catch (error) {
        console.log(error);
        return response.status(502).send({ message: 'Error while finding songs on last.fm.' });
    }

    return response.status(200).json(song);
});

module.exports = song;
