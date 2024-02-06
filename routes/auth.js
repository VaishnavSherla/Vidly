const express = require('express');
const router = express.Router();
const {User} = require('../models/user')
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send({ message: "Invalid email or password." });
    }

    const { email, password } = req.body;
    let user = await User.findOne({email: email});
    if (!user) return res.status(400).send({ message: "Invalid email or password." });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({ message: "Invalid email or password." });
    const token = user.generateAuthToken();
    
    res.setHeader('x-auth-token', token);
    res.send({message: "Successfully logged in!"});
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(user);
}


module.exports = router;