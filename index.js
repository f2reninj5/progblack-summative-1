require('dotenv').config();
const app = require('./app');

app.listen(process.env.PORT, () => {
    console.log(`Listening at port http://localhost:${process.env.PORT}...`);
});
