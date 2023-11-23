const { createHash } = require('crypto');
const database = require('../database');
require('dotenv').config();

module.exports = class User {
    /**
     * @param {string} username the username to search for
     * @returns a User object or null if a user wasn't found
     */
    static async findByUsername(username) {
        return database.User.findOne({
            where: { username }
        });
    }

    /**
    * @param {string} username the username to search for
    * @returns true if a user was found, otherwise false
    */
    static async existsByUsername(username) {
        return (await this.findByUsername(username)) ? true : false;
    }

    /**
     * @param {{ username: string, password: string }} attributes an object containing the attributes of the user to create
     * @returns a User object
     */
    static async create(attributes) {

        return database.User.create({
            username: attributes.username,
            password: this.hashPassword(attributes.password)
        });
    }

    /**
     * @param {string} password the password string to be hashed
     * @returns a hash binary string of the password
     */
    static hashPassword(password) {
        return createHash('sha256')
            .update(password + process.env.SALT)
            .digest('binary');
    }

    /**
     * @param {string} passwordHash the original password hash to compare the candidate against
     * @param {string} passwordCandidate the password candidate to validate
     * @returns true if the password is valid, otherwise false
     */
    static validPassword(passwordHash, passwordCandidate) {
        const candidateHash = this.hashPassword(passwordCandidate);
        return passwordHash === candidateHash;
    }

    /**
     * @param {string} username the username to search for
     * @param {string} password the user's password to validate
     * @returns true if the credentials are valid, otherwise false
     */
    static async validCredentials(username, password) {
        const user = await this.findByUsername(username);
        return this.validPassword(user.password, password);
    }
};
