const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authmiddleware');
const {
    getPendingSettlements,
    markSettlementCompleted,
    getSettlementReport
} = require('../controllers/settlementcontroller');

// All routes are admin-only
router.get('/pending', protect, authorize('ADMIN'), getPendingSettlements);
router.patch('/:orderId', protect, authorize('ADMIN'), markSettlementCompleted);
router.get('/report', protect, authorize('ADMIN'), getSettlementReport);

module.exports = router;
