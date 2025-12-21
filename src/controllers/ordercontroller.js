const Order = require('../models/order');
const Menu = require('../models/menu');
const Restaurant = require('../models/restaurant');

// Platform configuration
const PLATFORM_COMMISSION_RATE = 0.15; // 15%
const DELIVERY_FEE = 50; // Fixed delivery fee

// @desc    Create new order
// @route   POST /bitenow/orders
// @access  Private (CUSTOMER)
const createOrder = async (req, res) => {
    try {
        const { restaurantId, items, deliveryAddress, deliveryInstructions, paymentMethod } = req.body;

        // Validate input
        if (!restaurantId || !items || items.length === 0 || !deliveryAddress || !paymentMethod) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Validate payment method
        if (!['COD', 'ONLINE'].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        // Verify restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Fetch menu items and calculate prices
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const menu = await Menu.findById(item.menuId);
            
            if (!menu) {
                return res.status(404).json({ message: `Menu item ${item.menuId} not found` });
            }

            if (!menu.isAvailable) {
                return res.status(400).json({ message: `${menu.name} is not available` });
            }

            if (menu.restaurant.toString() !== restaurantId) {
                return res.status(400).json({ message: `${menu.name} does not belong to this restaurant` });
            }

            const itemTotal = menu.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                menu: menu._id,
                quantity: item.quantity,
                price: menu.price,
                name: menu.name
            });
        }

        // Calculate pricing breakdown
        const platformCommission = subtotal * PLATFORM_COMMISSION_RATE;
        const restaurantAmount = subtotal - platformCommission;
        const totalAmount = subtotal + DELIVERY_FEE;

        // Create order
        const order = await Order.create({
            customer: req.user._id,
            restaurant: restaurantId,
            items: orderItems,
            subtotal,
            deliveryFee: DELIVERY_FEE,
            platformCommission,
            restaurantAmount,
            totalAmount,
            paymentMethod,
            deliveryAddress,
            deliveryInstructions: deliveryInstructions || '',
            orderStatus: 'PENDING',
            paymentStatus: paymentMethod === 'ONLINE' ? 'PENDING' : 'PENDING'
        });

        // Populate order details
        await order.populate('customer', 'firstName lastName email phone');
        await order.populate('restaurant', 'name address phone');
        await order.populate('items.menu', 'name image');

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get customer's orders
// @route   GET /bitenow/orders/my-orders
// @access  Private (CUSTOMER)
const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('restaurant', 'name address phone image')
            .populate('items.menu', 'name image')
            .populate('deliveryMan', 'firstName lastName phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get customer orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get restaurant's orders
// @route   GET /bitenow/orders/restaurant-orders
// @access  Private (RESTAURANT)
const getRestaurantOrders = async (req, res) => {
    try {
        // Find restaurant owned by this user
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found for this user' });
        }

        const orders = await Order.find({ restaurant: restaurant._id })
            .populate('customer', 'firstName lastName phone')
            .populate('items.menu', 'name image')
            .populate('deliveryMan', 'firstName lastName phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get restaurant orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /bitenow/orders/:orderId
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('customer', 'firstName lastName email phone')
            .populate('restaurant', 'name address phone image')
            .populate('items.menu', 'name image description')
            .populate('deliveryMan', 'firstName lastName phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Authorization check
        const isCustomer = order.customer._id.toString() === req.user._id.toString();
        const isRestaurant = await Restaurant.findOne({ _id: order.restaurant._id, owner: req.user._id });
        const isDeliveryMan = order.deliveryMan && order.deliveryMan._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'ADMIN';

        if (!isCustomer && !isRestaurant && !isDeliveryMan && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error('Get order by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update order status
// @route   PATCH /bitenow/orders/:orderId/status
// @access  Private (RESTAURANT)
const updateOrderStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify restaurant ownership
        const restaurant = await Restaurant.findOne({ _id: order.restaurant, owner: req.user._id });
        if (!restaurant) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        // Validate status transitions
        const validTransitions = {
            'PENDING': ['ACCEPTED', 'REJECTED'],
            'ACCEPTED': ['PREPARING'],
            'PREPARING': ['READY_FOR_PICKUP'],
            'READY_FOR_PICKUP': ['OUT_FOR_DELIVERY']
        };

        if (!validTransitions[order.orderStatus] || !validTransitions[order.orderStatus].includes(status)) {
            return res.status(400).json({ 
                message: `Cannot transition from ${order.orderStatus} to ${status}` 
            });
        }

        // Update order
        order.orderStatus = status;
        
        if (status === 'ACCEPTED') {
            order.acceptedAt = new Date();
        }
        
        if (status === 'REJECTED') {
            order.rejectionReason = rejectionReason || 'No reason provided';
        }

        await order.save();

        await order.populate('customer', 'firstName lastName email phone');
        await order.populate('restaurant', 'name address phone');
        await order.populate('items.menu', 'name image');

        res.status(200).json({
            message: `Order ${status.toLowerCase()}`,
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Cancel order
// @route   PATCH /bitenow/orders/:orderId/cancel
// @access  Private (CUSTOMER)
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify customer ownership
        if (order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Can only cancel before OUT_FOR_DELIVERY
        if (['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Cannot cancel order at this stage' });
        }

        order.orderStatus = 'CANCELLED';
        await order.save();

        res.status(200).json({
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getCustomerOrders,
    getRestaurantOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};
