const express = require('express');
const { Products, validate } = require('../models/product');
const { Users } = require('../models/user');
const _ = require('lodash');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const products = await Products.find({ 'user': req.user._id })
                        // .populate('user')
                        .populate({
                            path: 'user',
                            select: '_id firstName' 
                          })
                        .select('_id name price user')
                        .sort('name');
    res.send(products);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await Users.findOne({_id: req.user._id});
    if(!user) return res.status(400).send('User does not exist');

    const product = new Products({
        name: req.body.name,
        price: req.body.price,
        user: user._id
    });

    await product.save();
    res.send(product);
});

module.exports = router;