const jwt = require('jsonwebtoken');
const config = require('config');
const { Users } = require('../models/user');

async function authenticate(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Unauthorized access. No token provided.');

    try {
        const user = jwt.verify(token, config.get('jwtPrivateKey'));
        const result = await Users.findOne({_id: user._id});
        if(!result) throw new Error('Invalid Token');
        req.user = user;
        next();
    }
    catch(err) {
        return res.status(401).send('Invalid Token.');
    }
}

module.exports = authenticate;
