const mongoose = require('mongoose');
const logger = require('../middleware/logger');
const config = require('config');

module.exports = function() {
    mongoose.connect(config.get('MONGOURI'))
    .then(() => {
        logger.info('Connected to MongoDB..');
    })
}