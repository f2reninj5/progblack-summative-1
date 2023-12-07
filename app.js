const Express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Playlist = require('./models/Playlist');
const Session = require('./models/Session');
const User = require('./models/User');
require('dotenv').config();

const DAY = 1000 * 60 * 60 * 24;
const app = new Express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(Express.static('public'));

app.post('/session/login', async (request, response) => {
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
        return response.status(400).send({ message: 'Missing session ID' });
    }

    try {
        const session = await Session.fetch(sessionId);

        if (!session) {
            return response.status(404).send({ message: 'No session with this ID found' });
        }

        if (session.expires <= new Date()) {
            return response.status(401).send({ message: 'Session expired' });
        }

        const user = session.user;
        return response.json({
            username: user.username
        });
    }
    catch (error) {
        return response.status(500).send({ message: 'Internal error while finding session' });
    }
});

app.post('/register', async (request, response) => {
    const credentials = request.body;

    if (!credentials.username || !credentials.password) {
        return response.status(400).send({ message: 'Missing username or password.' });
    }

    try {
        if (await User.existsByUsername(credentials.username)) {
            return response.status(409).send({ message: 'User with this username already exists.' });
        }

        const user = await User.create(credentials);
        const session = await Session.create(user.username);
        return response.cookie('sessionId', session.id).send({ message: 'Successfully created account.' });
    }
    catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Internal error while creating new user.' });
    }
});

app.post('/login', async (request, response) => {
    const credentials = request.body;

    if (!credentials.username || !credentials.password) {
        return response.status(400).send({ message: 'Missing username or password.' });
    }

    try {
        const user = await User.findByUsername(credentials.username);

        if (!user) {
            return response.status(401).send({ message: 'User with this username not found.' });
        }

        if (!(await User.validCredentials(credentials.username, credentials.password))) {
            return response.status(401).send({ message: 'Incorrect password given.' });
        }

        const session = await Session.create(credentials.username);

        return response.cookie('sessionId', session.id, { maxAge: 7 * DAY }).json({
            username: user.username
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Internal error while logging in.' });
    }
});

app.post('/logout', async (request, response) => {
    const sessionId = request.cookies.sessionId;

    if (sessionId) {
        try {
            await Session.delete(sessionId);
        }
        catch (error) {
            console.log(error);
        }
    }

    await response.clearCookie('sessionId').status(200).send({ message: 'Successfully logged out.' });
});

app.post('/user/:username/playlist/:name/', async (request, response) => {
    const token = request.get('Authorization')?.split('Bearer ')[1];
    const username = request.params.username;
    const name = request.params.name;

    if (!token) {
        return response.status(401).send({ message: 'Missing token.' });
    }

    try {
        if ((await Session.fetch(token))?.userUsername !== username) {
            return response.status(403).send({ message: 'Playlist cannot be created for this user.' });
        }

        if (!(await User.findByUsername(username))) {
            return response.status(401).send({ message: 'User with this username not found.' });
        }

        if (await Playlist.exists(username, name)) {
            return response.status(409).send({ message: 'Playlist with this name already exists.' });
        }

        const playlist = await Playlist.createForUser(username, name);
        return response.json({
            name: playlist.name,
            songs: []
        });
    }
    catch (error) {
        console.log(error);
        return response.status(500).send({ message: 'Internal error while creating playlist.' });
    }
});

module.exports = app;
