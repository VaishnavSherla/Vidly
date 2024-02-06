const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all genres
router.get('/', auth, async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// Get genre by ID
router.get('/:id', auth, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send({message: "The genre with Given ID Not Found"});
    res.send(genre);  
})

// Add a new genre
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const { name } = req.body;
    let genre = new Genre({name: name})
    genre = await genre.save();
    res.send(genre);
});

// Update a genre
router.put('/:id', auth,async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if (!genre) return res.status(404).send({message: "The genre with Given ID Not Found"});
    res.send(genre);
});

// Delete a genre
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send({message: "The genre with Given ID Not Found"});
    res.send(genre);
});

module.exports = router;