const app = require('./app');
const { sequelize } = require('./database');

sequelize.sync({ force: false })
    .then(app.listen(process.env.PORT))
    .then(() => {
        console.log(`Listening on port ${process.env.PORT}...`);
    });
