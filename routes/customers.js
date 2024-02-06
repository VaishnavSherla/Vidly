const express = require('express');
const router = express.Router();

const {Customer, validate} = require('../models/customer')

// Get all customers
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// Get customer by ID
router.get('/:id',async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send({message: "The customer with Given ID Not Found"});
    res.send(customer);  
})

// Add a new customer
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const { name, phone, isGold } = req.body;
    const customer = new Customer({
        name: name, 
        phone: phone, 
        isGold: isGold
    })
    await customer.save();
    res.send(customer);
});

// Update a customer
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const { name, phone, isGold } = req.body;

    const customer = await Customer.findByIdAndUpdate(
        req.params.id, 
        {
            name: name, 
            phone: phone, 
            isGold: isGold
        },
        {new: true}
    );
    if (!customer) return res.status(404).send({message: "The customer with Given ID Not Found"});
    res.send(customer);
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send({message: "The customer with Given ID Not Found"});
    res.send(customer);
});

module.exports = router;