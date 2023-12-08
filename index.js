const app = require('./app');

app.listen(process.env.PORT)
    .then(() => {
        console.log(`Listening on port ${process.env.PORT}...`);
    });
