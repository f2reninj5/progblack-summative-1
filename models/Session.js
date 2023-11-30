const database = require('../database');

const DAY = 1000 * 60 * 60 * 24;

module.exports = class Session {
    /**
     * @param {string} username the username of the user to associate with the session
     * @returns a Session object
     */
    static async create(username) {
        return database.Session.create({
            expires: new Date(Date.now() + 7 * DAY),
            userUsername: username
        }, {
            include: [database.User]
        });
    }

    // /**
    //  * @param {string} username the username of the user whose session to find
    //  * @returns a Session object
    //  */
    // static async findByUsername(username) {
    //     return database.Session.findOne({
    //         where: {
    //             userUsername: username,
    //             expires: {
    //                 [Op.gt]: new Date()
    //             }
    //         },
    //         include: database.User
    //     });
    // }

    /**
     * @param {string} id the ID of the session to fetch
     * @returns a Session object
     */
    static async fetch(id) {
        return database.Session.findOne({
            where: { id },
            include: database.User
        });
    }

    /**
     * @param {string} id the ID of the session to delete
     */
    static async delete(id) {
        await database.Session.destroy({
            where: { id }
        });
    }
};
