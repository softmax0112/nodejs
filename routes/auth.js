const express = require('express');
const {Users} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity')
const complexityOptions = {
        min: 5,
        max: 250,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
    };

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await Users.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid Username or password');

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) return res.status(400).send('Invalid Username or password');

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(user) {
    const schema = {
        email: Joi.string().email().min(5).max(255).required(),
        password: new PasswordComplexity(complexityOptions).required(),
    };
    return Joi.validate(user, schema);
}

module.exports = router;
