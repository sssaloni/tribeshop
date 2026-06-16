const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const { protectAdmin } = require('../middleware/auth.middleware');
const { validateProduct } = require('../middleware/validator.middleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', protectAdmin, validateProduct, createProduct);
router.put('/:id', protectAdmin, validateProduct, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;
