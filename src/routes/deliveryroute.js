const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authmiddleware');
const {
    assignDeliveryMan,
    getDeliveryManOrders,
    markDelivered,
    updateDeliveryStatus
} = require('../controllers/deliverycontroller');

// Admin routes
router.post('/assign', protect, authorize('ADMIN'), assignDeliveryMan);

// Delivery man routes
router.get('/my-deliveries', protect, authorize('DELIVERYMAN'), getDeliveryManOrders);
router.patch('/:orderId/deliver', protect, authorize('DELIVERYMAN'), markDelivered);
router.patch('/:orderId/status', protect, authorize('DELIVERYMAN'), updateDeliveryStatus);

module.exports = router;
