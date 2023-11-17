const Express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./database');
const Session = require('./models/Session');
const User = require('./models/User');
require('dotenv').config();

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
        return response.cookie('sessionId', session.id).redirect('/');
    }
    catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Internal error while creating new user.' });
    }
});

sequelize.sync({ force: false })
    .then(app.listen(process.env.PORT))
    .then(async () => {
        console.log(`Listening on port ${process.env.PORT}...`);
    });
