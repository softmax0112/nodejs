const express = require('express');
const winston = require('winston');
var cors = require('cors');

const app = express();
app.use(cors());
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    winston.info(`Listening on port ${port}`);
});
