const express = require('express');
const {Users, validate, validateUserForUpdate} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const router = express.Router();


router.get('/', auth, async (req, res) => {
    const users = await Users.find().sort('firstName').select('-password -__v');
    res.send(users);
});

router.get('/me', auth, async (req, res) => {
    const user = await Users.findById(req.user._id).select('-password -__v');       
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let result = await Users.findOne({email: req.body.email});
    if(result) return res.status(400).send('User already exists');

    const user = new Users(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
    const bSalt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, bSalt);
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstName', 'lastName', 'email']));
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validateUserForUpdate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let result = await Users.findOne({email: req.body.email});
    if(!result) return res.status(400).send('User does not exist');

    if(result._id.toString() !== req.user._id) return res.status(400).send('You do not have permission to dit this User');

    const userResult = await Users.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }, {
        new: true,
    });

    if(!userResult) return res.status(404).send('Course with the given Id does not exist');

    res.send(_.pick(userResult, ['_id', 'firstName', 'lastName', 'email']));
});

module.exports = router;
