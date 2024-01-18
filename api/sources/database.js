const fs = require('fs');
const path = require('path');

const root = '../../data';

/**
 * @enum { string }
 */
const Model = {
    User: 'users.json',
    Playlist: 'playlists.json'
};

/**
 * @param {Model} model which type of object is being read
 * @returns the resolved path to the object file
 */
function resolve(model) {
    return path.resolve(__dirname, root, model);
}

/**
 * - Create data folder if not found
 * - Create data file for each entity not found
 * - Create new files if not valid JSON
 */
(function initialiseData() {
    const resolvedRoot = path.resolve(__dirname, root);
    if (!fs.existsSync(resolvedRoot)) {
        fs.mkdirSync(resolvedRoot);
    }
    for (let key in Model) {
        const path = resolve(Model[key]);
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify([]));
        }
        else {
            const contents = fs.readFileSync(path);
            try {
                JSON.parse(contents);
            }
            catch (error) {
                console.log(`Failed to parse file at ${path}:`);
                console.log(contents.toString());
                console.log('Creating new file...');
                fs.writeFileSync(path, JSON.stringify([]));
            }
        }
    }
})();

// https://nodejs.org/dist/latest-v20.x/docs/api/fs.html#promises-api

/**
 * @param {Model} model which type of object is being read
 * @returns the file contents parsed as an object
 */
async function read(model) {
    const path = resolve(model);
    return JSON.parse(await fs.promises.readFile(path));
}

/**
 * @param {Model} model which type of object is being written
 * @param {{[key: string]: any}[]} data the data to write
 */
async function write(model, data) {
    const path = resolve(model);
    await fs.promises.writeFile(path, JSON.stringify(data));
}

const User = {
    /**
     * @param {string} username the username of the user to find
     * @returns a User object or null if not found
     */
    find: async function (username) {
        const users = await read(Model.User);
        const user = users.find((user) => user.username === username);
        return user || null;
    },
    /**
     * @param {string} username the username of the user to create
     * @param {{profileColour: string}} data the attributes to give the User object
     * @returns a User object
     */
    create: async function (username, data) {
        const users = await read(Model.User);
        const user = {
            username,
            profileColour: data.profileColour,
            createdAt: Date.now()
        };
        users.push(user);
        await write(Model.User, users);
        return user;
    },
    /**
     * @param {string} username the username of the user to delete
     */
    delete: async function (username) {
        const users = await read(Model.User);
        await write(Model.User, users.filter((user) => user.username !== username));
    },
    /**
     * @param {string} username the username of the user to update
     * @param {{profileColour?: string}} data the attributes to replace in the User object
     * @returns a User object
     */
    update: async function (username, data) {
        const users = await read(Model.User);
        const user = users.find((user) => user.username === username);
        if (data.profileColour) {
            user.profileColour = data.profileColour;
        }
        await write(Model.User, users);
        return user;
    }
};

const Playlist = {
    /**
     * @param {string} username the username of the user whose playlist to find
     * @param {string} name the name of the playlist to find
     * @returns a Playlist object or null if not found
     */
    find: async function (username, name) {
        const playlists = await read(Model.Playlist);
        const playlist = playlists.find((playlist) => playlist.user.username === username && playlist.name === name);
        return playlist || null;
    },
    /**
     * @param {string} username the username of the user whose playlists to find
     * @returns an array of Playlist objects
     */
    findAll: async function (username) {
        const playlists = await read(Model.Playlist);
        return playlists
            .filter((playlist) => playlist.user.username === username)
            .map((playlist) => ({ name: playlist.name, createdAt: playlist.createdAt, songCount: playlist.songs.length }));
    },
    /**
     * @param {string} username the username of the user whose playlist to create
     * @param {string} name the name of the playlist to create
     * @returns a Playlist object
     */
    create: async function (username, name) {
        const playlists = await read(Model.Playlist);
        const playlist = {
            user: {
                username
            },
            name,
            songs: [],
            createdAt: Date.now()
        };
        playlists.push(playlist);
        await write(Model.Playlist, playlists);
        return playlist;
    },
    /**
     * @param {string} username the username of the user whose playlist to delete
     * @param {string} name the name of the playlist to delete
     */
    delete: async function (username, name) {
        const playlists = await read(Model.Playlist);
        await write(Model.Playlist, playlists.filter((playlist) => !(playlist.user.username === username && playlist.name === name)));
    },
    /**
     * @param {string} username the username of the user whose playlist to update
     * @param {string} name the name of the playlist to update
     * @param {{artist: string, title: string}} song a Song object to add to the playlist
     * @returns a Playlist object
     */
    addSong: async function (username, name, song) {
        const playlists = await read(Model.Playlist);
        const playlist = playlists.find((playlist) => playlist.user.username === username && playlist.name === name);
        playlist.songs.push(song);
        await write(Model.Playlist, playlists);
        return playlist;
    },
    /**
     * @param {string} username the username of the user whose playlist to update
     * @param {string} name the name of the playlist to update
     * @param {number} index the index (from 0) of the song to remove
     * @returns a Playlist object
     */
    removeSong: async function (username, name, index) {
        const playlists = await read(Model.Playlist);
        const playlist = playlists.find((playlist) => playlist.user.username === username && playlist.name === name);
        playlist.songs.splice(index, 1);
        await write(Model.Playlist, playlists);
        return playlist;
    }
};

module.exports = { Playlist, User };
