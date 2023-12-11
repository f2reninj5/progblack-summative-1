const fs = require('fs');

const root = '../data';

/**
 * @enum { string }
 */
const Model = {
    User: 'users.json',
    Playlist: 'playlists.json'
};

(function initialiseData() {
    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }
    for (let key in Model) {
        const path = [root, Model[key]].join('/');
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

/**
 * @param {Model} model which type of object is being read
 */
function read(model) {
    const path = [root, model].join('/');
    return JSON.parse(fs.readFileSync(path));
}

/**
 * @param {Model} model which type of object is being written
 * @param {{[key: string]: any}[]} data the data to write
 */
function write(model, data) {
    const path = [root, model].join('/');
    fs.writeFileSync(path, JSON.stringify(data));
}

const User = {
    /**
     * @param {string} username the username of the user to find
     * @returns a User object or null if not found
     */
    find: function (username) {
        const users = read(Model.User);
        const user = users.find((user) => user.username == username);
        return user || null;
    },
    /**
     * @param {string} username the username of the user to create
     * @param {{profileColor: string}} data
     * @returns a User object
     */
    create: function (username, data) {
        const users = read(Model.User);
        const user = {
            username,
            profileColor: data.profileColour,
            createdAt: Date.now()
        };
        users.push(user);
        write(Model.User, users);
        return user;
    },
    /**
     * @param {string} username the username of the user to delete
     */
    delete: function (username) {
        const users = read(Model.User);
        write(Model.User, users.filter((user) => user.username !== username));
    }
};

const Playlist = {
    /**
     * @param {string} username the username of the user whose playlist to find
     * @param {string} name the name of the playlist to find
     * @returns a Playlist object or null if not found
     */
    find: function (username, name) {
        const playlists = read(Model.Playlist);
        const playlist = playlists.find((playlist) => playlist.user.username == username && playlist.name == name);
        return playlist || null;
    },
    /**
     * @param {*} username the username of the user whose playlist to create
     * @param {*} name the name of the playlist to create
     * @returns a Playlist object
     */
    create: function (username, name) {
        const playlists = read(Model.Playlist);
        const playlist = {
            user: {
                username
            },
            name,
            songs: [],
            createdAt: Date.now()
        };
        playlists.push(playlist);
        write(Model.Playlist, playlists);
        return playlist;
    },
    /**
     * @param {string} username the username of the user whose playlist to update
     * @param {string} name the name of the playlist to update
     * @param {{artist: string, title: string}} song a Song object to add to the playlist
     * @returns a Playlist object
     */
    addSong: function (username, name, song) {
        const playlists = read(Model.Playlist);
        const playlist = playlists.find((playlist) => playlist.user.username == username && playlist.name == name);
        playlist.songs.push(song);
        write(Model.Playlist, playlists);
        return playlist;
    },
    /**
     * @param {string} username the username of the user whose playlist to update
     * @param {string} name the name of the playlist to update
     * @param {number} index the index (from 0) of the song to remove
     * @returns a Playlist object
     */
    removeSong: function (username, name, index) {
        const playlists = read(Model.Playlist);
        const playlist = playlists.find((playlist) => playlist.user.username == username && playlist.name == name);
        playlist.songs.splice(index, 1);
        write(Model.Playlist, playlists);
        return playlist;
    }
};

module.exports = { Playlist, User };
