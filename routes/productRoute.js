const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getProduct,
    getAllProducts,
    updateProduct
} = require('../controller/productController');

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.get('/:id', getProduct);
router.get('/', getAllProducts);

module.exports = router;