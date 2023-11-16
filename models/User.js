const database = require('../database');

module.exports = class User {
    /**
     * @param {{}} attributes an object of User attributes to confine the search by
     * @returns a User object or null if a user wasn't found
     */
    static async find(attributes) {
        const orQuery = [];

        if (attributes.username) {
            orQuery.push({ username: attributes.username });
        }
        if (attributes.password) {
            orQuery.push({ password: attributes.password });
        }
        if (orQuery.length === 0) { return; }

        const user = await database.User.findOne({
            where: { [Op.or]: orQuery }
        });

        return user;
    }

    /**
    * @param {{}} attributes an object of User attributes to confine the search by
    * @returns true if a user was found, otherwise false
    */
    static async exists(attributes) {
        return (await findUser()) ? true : false;
    }
};
