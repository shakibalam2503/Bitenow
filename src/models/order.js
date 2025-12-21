const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [{
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    
    // Pricing breakdown
    subtotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 50
    },
    platformCommission: {
        type: Number,
        required: true
    },
    restaurantAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    
    // Order tracking
    orderStatus: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    
    // Payment
    paymentMethod: {
        type: String,
        enum: ['COD', 'ONLINE'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    },
    transactionId: {
        type: String,
        default: null
    },
    
    // Delivery
    deliveryMan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    deliveryInstructions: {
        type: String,
        default: ''
    },
    
    // Settlement
    settlementStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
    },
    settledAt: {
        type: Date,
        default: null
    },
    
    // Timestamps
    acceptedAt: {
        type: Date,
        default: null
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, createdAt: -1 });
orderSchema.index({ deliveryMan: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ settlementStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
