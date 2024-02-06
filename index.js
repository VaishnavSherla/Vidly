const express = require('express');
const logger = require('./middleware/logger');

const app = express();

require('./startup/errors')();
require('./startup/routes')(app);
require('./startup/validation')();
require('./startup/config')();
require('./startup/db')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
app.listen(port, function() {
    logger.info(`Listening on http://127.0.0.1:${port}`);
});