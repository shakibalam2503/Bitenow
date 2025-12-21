const Order = require('../models/order');

// @desc    Get pending settlements
// @route   GET /bitenow/settlements/pending
// @access  Private (ADMIN)
const getPendingSettlements = async (req, res) => {
    try {
        const pendingSettlements = await Order.find({
            orderStatus: 'DELIVERED',
            paymentStatus: 'COMPLETED',
            settlementStatus: 'PENDING'
        })
            .populate('customer', 'firstName lastName')
            .populate('restaurant', 'name')
            .populate('deliveryMan', 'firstName lastName')
            .sort({ deliveredAt: -1 });

        // Calculate totals
        const totalPlatformCommission = pendingSettlements.reduce((sum, order) => sum + order.platformCommission, 0);
        const totalRestaurantAmount = pendingSettlements.reduce((sum, order) => sum + order.restaurantAmount, 0);
        const totalDeliveryFee = pendingSettlements.reduce((sum, order) => sum + order.deliveryFee, 0);

        res.status(200).json({
            count: pendingSettlements.length,
            summary: {
                totalPlatformCommission,
                totalRestaurantAmount,
                totalDeliveryFee
            },
            settlements: pendingSettlements
        });
    } catch (error) {
        console.error('Get pending settlements error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark settlement as completed
// @route   PATCH /bitenow/settlements/:orderId
// @access  Private (ADMIN)
const markSettlementCompleted = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order is delivered and paid
        if (order.orderStatus !== 'DELIVERED') {
            return res.status(400).json({ message: 'Order must be delivered' });
        }

        if (order.paymentStatus !== 'COMPLETED') {
            return res.status(400).json({ message: 'Payment must be completed' });
        }

        // Check if already settled
        if (order.settlementStatus === 'COMPLETED') {
            return res.status(400).json({ message: 'Settlement already completed' });
        }

        // Mark as settled
        order.settlementStatus = 'COMPLETED';
        order.settledAt = new Date();
        await order.save();

        res.status(200).json({
            message: 'Settlement marked as completed',
            order: {
                _id: order._id,
                settlementStatus: order.settlementStatus,
                settledAt: order.settledAt,
                platformCommission: order.platformCommission,
                restaurantAmount: order.restaurantAmount,
                deliveryFee: order.deliveryFee
            }
        });
    } catch (error) {
        console.error('Mark settlement completed error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get settlement report
// @route   GET /bitenow/settlements/report
// @access  Private (ADMIN)
const getSettlementReport = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;

        // Build query
        const query = {
            orderStatus: 'DELIVERED',
            paymentStatus: 'COMPLETED'
        };

        if (status) {
            query.settlementStatus = status;
        }

        if (startDate && endDate) {
            query.deliveredAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const settlements = await Order.find(query)
            .populate('customer', 'firstName lastName')
            .populate('restaurant', 'name')
            .populate('deliveryMan', 'firstName lastName')
            .sort({ deliveredAt: -1 });

        // Calculate totals
        const totalOrders = settlements.length;
        const totalRevenue = settlements.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalPlatformCommission = settlements.reduce((sum, order) => sum + order.platformCommission, 0);
        const totalRestaurantAmount = settlements.reduce((sum, order) => sum + order.restaurantAmount, 0);
        const totalDeliveryFee = settlements.reduce((sum, order) => sum + order.deliveryFee, 0);

        // Count by payment method
        const codOrders = settlements.filter(o => o.paymentMethod === 'COD').length;
        const onlineOrders = settlements.filter(o => o.paymentMethod === 'ONLINE').length;

        // Count by settlement status
        const pendingSettlements = settlements.filter(o => o.settlementStatus === 'PENDING').length;
        const completedSettlements = settlements.filter(o => o.settlementStatus === 'COMPLETED').length;

        res.status(200).json({
            summary: {
                totalOrders,
                totalRevenue,
                totalPlatformCommission,
                totalRestaurantAmount,
                totalDeliveryFee,
                paymentMethods: {
                    cod: codOrders,
                    online: onlineOrders
                },
                settlementStatus: {
                    pending: pendingSettlements,
                    completed: completedSettlements
                }
            },
            settlements
        });
    } catch (error) {
        console.error('Get settlement report error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getPendingSettlements,
    markSettlementCompleted,
    getSettlementReport
};
