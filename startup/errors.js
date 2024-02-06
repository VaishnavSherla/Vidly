const logger = require('../middleware/logger');

module.exports = function() {
    process.on('uncaughtException', (err) => {
        logger.log("UnCaughtException: ", err);
        logger.error('Uncaught Exception:', err);
        process.exit(1);
    });
    process.on('unhandledRejection', (err) => {
        logger.log("UnCaughtException: ", err);
        logger.error('Unhandled Rejection:', err);
        process.exit(1)
    });
}