const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authmiddleware');
const {
    simulateBkashPayment,
    verifyPayment,
    markCODCollected
} = require('../controllers/paymentcontroller');

// Customer routes
router.post('/simulate-bkash', protect, authorize('CUSTOMER'), simulateBkashPayment);

// General routes
router.post('/verify', protect, verifyPayment);

// Delivery man routes
router.patch('/:orderId/cod', protect, authorize('DELIVERYMAN'), markCODCollected);

module.exports = router;
