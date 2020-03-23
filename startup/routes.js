const express = require('express');
const error = require('../middlewares/error');
// const authenticate = require('../middlewares/auth');
const users = require('../routes/users');
const products = require('../routes/products');
const auth = require('../routes/auth');
const home = require('../routes/home');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.static('public'));
    
    // // app.use(authenticate);
    app.use('/', home);
    // app.use('/api/courses', courses);
    // app.use('/api/customers', customers);
    // app.use('/api/movies', movies);
    // app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/products', products);
    app.use('/api/auth', auth);
    app.use(error);
};