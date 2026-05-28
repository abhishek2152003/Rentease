import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // Check stock and verify availability first
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product || !product.isAvailable || product.stock < item.qty) {
                res.status(400);
                throw new Error(`Product ${item.name} is currently out of stock or unavailable.`);
            }
        }

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 10);

        const order = new Order({
            orderItems: orderItems.map((x) => ({
                name: x.name,
                qty: x.qty,
                image: x.image,
                price: x.price,
                rentalDurationDays: x.rentalDurationDays,
                product: x.product,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            totalPrice,
            deliveryDate,
            status: paymentMethod === 'Cash on Delivery' ? 'Confirmed' : 'Pending',
        });

        const createdOrder = await order.save();

        // Deduct stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.qty;
                if (product.stock <= 0) {
                    product.stock = 0;
                    product.isAvailable = false;
                }
                await product.save();
            }
        }

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.status = status;
    
    if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    await order.save();
    res.json({ message: "Order status updated", order });
});

export {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
};
