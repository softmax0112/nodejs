const Joi = require('joi');
const mongoose = require('mongoose');
const { userSchema } = require('./user');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
});

const Products = mongoose.model('Products', productSchema);

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        price: Joi.number().min(0).required(),
    };
    return Joi.validate(product, schema);
}

exports.Products = Products;
exports.userSchema = productSchema;
exports.validate = validateProduct;