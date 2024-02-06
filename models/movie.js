const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('../models/genre')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().integer().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    });

    return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;