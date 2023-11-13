const Express = require('express');
const { createHash } = require('crypto');
const { sequelize, User } = require('./database');
require('dotenv').config();

const app = new Express();

app.use(Express.static('public'));

// let p = createHash('sha256').update('a' + process.env.SALT).digest('binary');

sequelize.sync({ force: false })
    .then(app.listen(process.env.PORT))
    .then(() => {
        console.log(`Listening on port ${process.env.PORT}...`);
    });
