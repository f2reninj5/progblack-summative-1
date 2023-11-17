const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.HOST,
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    dialect: 'mysql',
    logging: false
});

const Playlist = sequelize.define('playlist', {
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    }
}, {
    indexes: [{
        unique: true,
        fields: ['userUsername', 'name']
    }]
});

const Session = sequelize.define('session', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

const Song = sequelize.define('song', {
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING(16),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(32).BINARY,
        allowNull: false
    }
});

User.hasMany(Session);
Session.belongsTo(User);

User.hasMany(Playlist);
Playlist.belongsTo(User);

Playlist.hasMany(Song);
Song.belongsToMany(Playlist, {
    through: 'playlist_songs'
});

module.exports = {
    sequelize,
    Playlist,
    Session,
    User
};
