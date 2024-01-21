// https://www.last.fm/api
const LastFM = {
    host: 'https://ws.audioscrobbler.com/2.0/?',
    api_key: 'a5f946a067f8945ab819fdb99a0a33ae',
    format: 'json',
    methods: {
        artist: {
            getInfo: (artist) => LastFM.buildURL('artist.getInfo', { artist })
        },
        track: {
            getInfo: (track, artist) => LastFM.buildURL('track.getInfo', { track, artist }),
            search: (track) => LastFM.buildURL('track.search', { track })
        }
    },
    buildURL: function (method, params) {
        const searchParams = new URLSearchParams({
            api_key: LastFM.api_key,
            format: LastFM.format,
            method: method,
            ...params
        });
        return LastFM.host + searchParams.toString();
    }
};

const Artist = {
    /**
     * @param {string} artist the name of the artist whose information to get
     * @returns an object of information from the artist's last.fm page
     */
    get: async function (artist) {
        const url = LastFM.methods.artist.getInfo(artist);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        let body = await response.json();
        if (body.error) {
            if (body.error === 6) {
                return null;
            }
            throw new Error(body.message);
        }
        body = body.artist;
        return {
            name: body.name,
            url: body.url,
            image: body.image.find((image) => image.size === 'large')['#text'],
            stats: {
                listeners: parseInt(body.stats.listeners),
                playcount: parseInt(body.stats.playcount)
            },
            similar: body.similar.artist.map((artist) => ({
                name: artist.name,
                url: artist.url,
                image: artist.image.find((image) => image.size === 'medium')['#text']
            }))
        };
    }
};

const Song = {
    /**
     * @param {string} track the name of the song to get information about
     * @param {string} artist the name of the artist who owns the song
     * @returns an object of information from the song's last.fm page
     */
    get: async function (track, artist) {
        const url = LastFM.methods.track.getInfo(track, artist);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        let body = await response.json();
        if (body.error) {
            if (body.error === 6) {
                return null;
            }
            throw new Error(body.message);
        }
        body = body.track;
        delete body.streamable;
        body.album.image = body.album.image.find((image) => image.size === 'large')['#text'];
        body.tags = body.toptags.tag;
        delete body.toptags;
        return body;
    },
    /**
     * @param {string} track the name of the song to search for
     * @returns an array of song matches or an empty array if none found
     */
    findAll: async function (track) {
        const url = LastFM.methods.track.search(track);
        const response = await fetch(url);
        if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
        }
        let body = await response.json();
        if (body.error) {
            throw new Error(body.message);
        }
        let tracks = body.results.trackmatches.track.map((track) => ({
            name: track.name,
            artist: track.artist,
            url: track.url,
            listeners: track.listeners,
            image: track.image.find((image) => image.size === 'large')['#text']
        }));
        return tracks;
    }
};

module.exports = { Artist, Song };
