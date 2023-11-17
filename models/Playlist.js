const database = require('../database');

module.exports = class Playlist {
    /**
     * @param {string} username the username of the user whose playlists to find
     * @param {number} page the page number indexed from 0
     * @param {number} pageSize how many results to return in one page
     * @returns an array of Playlist objects and the total count of playlists of the user
     */
    static async findPlaylistsByUser(username, page = 0, pageSize = 100) {
        return database.Playlist.findAndCountAll({
            where: { userUsername: username },
            limit: pageSize,
            offset: pageSize * page,
            order: [['name', 'ASC']]
        });
    }
};
