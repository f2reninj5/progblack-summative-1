const database = require('../database');

module.exports = class Playlist {
    /**
     * @param {string} username the username of the user whose playlists to find
     * @param {number} page the page number indexed from 0
     * @param {number} pageSize how many results to return in one page
     * @returns an array of Playlist objects and the total count of playlists of the user
     */
    static async findByUser(username, page = 0, pageSize = 100) {
        return database.Playlist.findAndCountAll({
            where: { userUsername: username },
            limit: pageSize,
            offset: pageSize * page,
            order: [['name', 'ASC']]
        });
    }

    /**
     * @param {string} username username of user whose playlist to create
     * @param {string} name name of playlist to create
     * @returns a Playlist object
     */
    static async createForUser(username, name) {
        return database.Playlist.create({
            name: name,
            userUsername: username
        });
    }

    /**
     * @param {string} username username of user whose playlist to fetch
     * @param {string} name name of playlist to fetch
     * @returns a Playlist object or null if a playlist wasn't found
     */
    static async fetch(username, name) {
        return database.Playlist.findOne({
            where: {
                name: name,
                userUsername: username
            }
        });
    }

    /**
     * @param {string} username username of user whose playlist to search for
     * @param {string} name name of playlist to search for
     * @returns true if a playlist was found, otherwise false
     */
    static async exists(username, name) {
        return !!(await this.fetch(username, name));
    }
};
