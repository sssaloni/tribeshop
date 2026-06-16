const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/order.controller');
const { protectAdmin } = require('../middleware/auth.middleware');
const { validateOrder } = require('../middleware/validator.middleware');

// Public route to place order
router.post('/', validateOrder, createOrder);

// Admin-only route to view all orders
router.get('/', protectAdmin, getOrders);

module.exports = router;
