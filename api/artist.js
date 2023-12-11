const Express = require('express');
const { Artist } = require('./sources/LastFM');

const artist = Express.Router();

artist.use('/:name', async (request, response, next) => {
    const name = request.params.name;
    let artist;

    try {
        artist = await Artist.get(name);
    }
    catch (error) {
        console.log(error);
        return response.status(501).send({ message: 'Internal server error while finding artist.' });
    }

    if (!artist) {
        return response.status(404).send({ message: 'No artist with this name found.' });
    }

    request.artist = artist;
    next();
});

artist.use('/:name/song', require('./artist.song'));

artist.get('/:name', (request, response) => {
    const artist = request.artist;
    return response.status(200).json(artist);
});

module.exports = artist;
