const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
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

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
    },
    lastName: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
    },
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, name: `${this.firstName} ${this.lastName}`}, config.get('jwtPrivateKey'));
};

const Users = mongoose.model('Users', userSchema);

function validateUser(user) {
    const schema = {
        firstName: Joi.string().min(5).max(255).required(),
        lastName: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: new PasswordComplexity(complexityOptions).required(),
    };
    return Joi.validate(user, schema);
}

function validateUserForUpdate(user) {
    const schema = {
        firstName: Joi.string().min(5).max(255).required(),
        lastName: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}

exports.Users = Users;
exports.userSchema = userSchema;
exports.validate = validateUser;
exports.validateUserForUpdate = validateUserForUpdate;