const Order = require('../models/order');
const crypto = require('crypto');

// @desc    Simulate bKash payment
// @route   POST /bitenow/payments/simulate-bkash
// @access  Private (CUSTOMER)
const simulateBkashPayment = async (req, res) => {
    try {
        const { orderId, phoneNumber } = req.body;

        if (!orderId || !phoneNumber) {
            return res.status(400).json({ message: 'Please provide order ID and phone number' });
        }

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify customer ownership
        if (order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if order payment method is ONLINE
        if (order.paymentMethod !== 'ONLINE') {
            return res.status(400).json({ message: 'This order is not for online payment' });
        }

        // Check if already paid
        if (order.paymentStatus === 'COMPLETED') {
            return res.status(400).json({ message: 'Payment already completed' });
        }

        // Generate fake transaction ID (simulated)
        const transactionId = `BKASH${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // Simulate payment success (in real world, this would call bKash API)
        order.paymentStatus = 'COMPLETED';
        order.transactionId = transactionId;
        await order.save();

        res.status(200).json({
            message: 'Payment successful (simulated)',
            transactionId,
            amount: order.totalAmount,
            paymentMethod: 'bKash',
            order: {
                _id: order._id,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus
            }
        });
    } catch (error) {
        console.error('Simulate bKash payment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify payment status
// @route   POST /bitenow/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'Please provide order ID' });
        }

        const order = await Order.findById(orderId)
            .select('paymentStatus paymentMethod transactionId totalAmount');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            orderId: order._id,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            transactionId: order.transactionId,
            amount: order.totalAmount
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark COD as collected
// @route   PATCH /bitenow/payments/:orderId/cod
// @access  Private (DELIVERYMAN)
const markCODCollected = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify delivery man assignment
        if (!order.deliveryMan || order.deliveryMan.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized. You are not assigned to this order.' });
        }

        // Check if order is COD
        if (order.paymentMethod !== 'COD') {
            return res.status(400).json({ message: 'This order is not Cash on Delivery' });
        }

        // Check if order is delivered
        if (order.orderStatus !== 'DELIVERED') {
            return res.status(400).json({ message: 'Order must be delivered first' });
        }

        // Check if already collected
        if (order.paymentStatus === 'COMPLETED') {
            return res.status(400).json({ message: 'COD already marked as collected' });
        }

        // Mark as collected
        order.paymentStatus = 'COMPLETED';
        await order.save();

        res.status(200).json({
            message: 'COD marked as collected',
            order: {
                _id: order._id,
                paymentStatus: order.paymentStatus,
                totalAmount: order.totalAmount
            }
        });
    } catch (error) {
        console.error('Mark COD collected error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    simulateBkashPayment,
    verifyPayment,
    markCODCollected
};
