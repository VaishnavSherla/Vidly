const config = require('config');
const logger = require('../middleware/logger');

module.exports = function () {
    if (!config.has('jwtPrivateKey')) {
        logger.error("FATAL Err: jwtPrivateKey isn't defined!")
        process.exit(1);
    }
    if (!config.has('MONGOURI')) {
        logger.error("FATAL Err: MONGOURI isn't defined!")
        process.exit(1);
    }
}