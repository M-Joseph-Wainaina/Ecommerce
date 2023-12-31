const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);

    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//get a product

const getProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//get all products

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (error) {
        throw new Error(error);
    }
});

//update a product

const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params;
        
    try{
        if (req.body.title) req.body.slug = slugify(req.body.title);
        const updateProduct = await Product.findOneAndUpdate(
            {id},
            req.body,
            {new: true}
        );
        res.json(updateProduct);
    } 
    catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct
}