const Order = require('../models/order');
const User = require('../models/user');

// @desc    Assign delivery man to order
// @route   POST /bitenow/delivery/assign
// @access  Private (ADMIN)
const assignDeliveryMan = async (req, res) => {
    try {
        const { orderId, deliveryManId } = req.body;

        if (!orderId || !deliveryManId) {
            return res.status(400).json({ message: 'Please provide order ID and delivery man ID' });
        }

        // Verify delivery man exists and has correct role
        const deliveryMan = await User.findById(deliveryManId);
        if (!deliveryMan) {
            return res.status(404).json({ message: 'Delivery man not found' });
        }

        if (deliveryMan.role !== 'DELIVERYMAN') {
            return res.status(400).json({ message: 'User is not a delivery man' });
        }

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check order status
        if (order.orderStatus !== 'READY_FOR_PICKUP') {
            return res.status(400).json({ 
                message: 'Order must be in READY_FOR_PICKUP status to assign delivery man' 
            });
        }

        // Assign delivery man and update status
        order.deliveryMan = deliveryManId;
        order.orderStatus = 'OUT_FOR_DELIVERY';
        await order.save();

        await order.populate('customer', 'firstName lastName phone');
        await order.populate('restaurant', 'name address phone');
        await order.populate('deliveryMan', 'firstName lastName phone');
        await order.populate('items.menu', 'name image');

        res.status(200).json({
            message: 'Delivery man assigned successfully',
            order
        });
    } catch (error) {
        console.error('Assign delivery man error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get delivery man's orders
// @route   GET /bitenow/delivery/my-deliveries
// @access  Private (DELIVERYMAN)
const getDeliveryManOrders = async (req, res) => {
    try {
        const orders = await Order.find({ deliveryMan: req.user._id })
            .populate('customer', 'firstName lastName phone')
            .populate('restaurant', 'name address phone image')
            .populate('items.menu', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get delivery man orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark order as delivered
// @route   PATCH /bitenow/delivery/:orderId/deliver
// @access  Private (DELIVERYMAN)
const markDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify delivery man assignment
        if (!order.deliveryMan || order.deliveryMan.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized. You are not assigned to this order.' });
        }

        // Check current status
        if (order.orderStatus !== 'OUT_FOR_DELIVERY') {
            return res.status(400).json({ 
                message: 'Order must be OUT_FOR_DELIVERY to mark as delivered' 
            });
        }

        // Mark as delivered
        order.orderStatus = 'DELIVERED';
        order.deliveredAt = new Date();
        await order.save();

        await order.populate('customer', 'firstName lastName phone');
        await order.populate('restaurant', 'name address phone');
        await order.populate('items.menu', 'name image');

        res.status(200).json({
            message: 'Order marked as delivered',
            order
        });
    } catch (error) {
        console.error('Mark delivered error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update delivery status
// @route   PATCH /bitenow/delivery/:orderId/status
// @access  Private (DELIVERYMAN)
const updateDeliveryStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify delivery man assignment
        if (!order.deliveryMan || order.deliveryMan.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Only allow OUT_FOR_DELIVERY status update
        if (status !== 'OUT_FOR_DELIVERY') {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({
            message: 'Delivery status updated',
            order
        });
    } catch (error) {
        console.error('Update delivery status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    assignDeliveryMan,
    getDeliveryManOrders,
    markDelivered,
    updateDeliveryStatus
};
