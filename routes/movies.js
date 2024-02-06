const express = require('express');
const router = express.Router();
const {Movie, validate} = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth')

// Get movies
router.get('/', auth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const movies = await Movie.find()
        .sort('name')
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    
    res.send(movies);
});

// Get movie by ID
router.get('/:id',auth, async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send({message: "The movie with Given ID Not Found"});
    res.send(movie);  
})

// Add a new movie
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const { title, genreId, numberInStock, dailyRentalRate} = req.body;
    const genre = await Genre.findById(genreId)
    if (!genre) return res.status(404).send({message: 'Invalid Genre!'})

    const movie = new Movie({
        title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock,
        dailyRentalRate
    });
    await movie.save();
    res.send(movie);
});

// Update a movie
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const { title, genreId, numberInStock, dailyRentalRate} = req.body;
    const genre = await Genre.findById(genreId)
    if (!genre) return res.status(404).send({message: 'Invalid Genre!'})

    const movie = await Movie.findByIdAndUpdate(
        req.params.id, 
        {
            title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock,
            dailyRentalRate
        },
        {new: true}
    );
    if (!movie) return res.status(404).send({message: "The movie with Given ID Not Found"});
    res.send(movie);
});

// Delete a movie
router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send({message: "The movie with Given ID Not Found"});
    res.send(movie);
});

module.exports = router;