const Express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const { createHash } = require('crypto');
const { sequelize } = require('./database');
const User = require('./models/User');
require('dotenv').config();

const app = new Express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(Express.static('public'));

// let p = createHash('sha256').update('a' + process.env.SALT).digest('binary');

app.post('register', async (request, response) => {
    const credentials = request.body;

    if (!credentials.username || !credentials.password) {
        return response.status(400);
    }

    if (await User.exists()) {

    }
});

sequelize.sync({ force: false })
    .then(app.listen(process.env.PORT))
    .then(() => {
        console.log(`Listening on port ${process.env.PORT}...`);
    });
