const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");

// Get all rentals
router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort('name');
        res.send(rentals);
    } catch (error) {
        res.status(500).send({message:'Something went wrong.'});
    }
});

// Get rental by ID
router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).send({ message: "The rental with Given ID Not Found" });
        res.send(rental);
    } catch (error) {
        res.status(500).send('Something went wrong.');
    }
});

// Add a new rental
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const { customerId, movieId } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) {
        return res.status(404).send({message: "Invalid Customer ID."});
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
        return res.status(404).send({message: "Invalid Movie ID."});
    }

    if (movie.numberInStock === 0) {
        return res.status(400).send({message: 'Movie not in stock.'});
    }

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    await rental.save();
    movie.numberInStock -= 1;
    await movie.save();

    res.send(rental);
});

module.exports = router;
