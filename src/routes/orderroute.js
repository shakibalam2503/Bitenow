const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authmiddleware');
const {
    createOrder,
    getCustomerOrders,
    getRestaurantOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/ordercontroller');

// Customer routes
router.post('/', protect, authorize('CUSTOMER'), createOrder);
router.get('/my-orders', protect, authorize('CUSTOMER'), getCustomerOrders);
router.patch('/:orderId/cancel', protect, authorize('CUSTOMER'), cancelOrder);

// Restaurant routes
router.get('/restaurant-orders', protect, authorize('RESTAURANT'), getRestaurantOrders);
router.patch('/:orderId/status', protect, authorize('RESTAURANT'), updateOrderStatus);

// General routes (accessible by customer, restaurant, delivery man, admin)
router.get('/:orderId', protect, getOrderById);

module.exports = router;
