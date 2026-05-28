import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res) => {
    const { orderId } = req.body;

    const mongoOrder = await Order.findById(orderId);
    if (!mongoOrder) {
        res.status(404);
        throw new Error('Order not found');
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: Math.round(mongoOrder.totalPrice * 100), // in paise
        currency: 'INR',
        receipt: `order_rcptid_${mongoOrder._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    // Save the Razorpay Order ID to the DB
    mongoOrder.razorpayOrderId = razorpayOrder.id;
    await mongoOrder.save();

    res.status(200).json({
        id: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
        key: process.env.RAZORPAY_KEY_ID
    });
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const mongoOrder = await Order.findById(orderId);
        if (mongoOrder) {
            mongoOrder.isPaid = true;
            mongoOrder.paidAt = Date.now();
            mongoOrder.paymentStatus = 'paid';
            mongoOrder.status = 'Confirmed';
            mongoOrder.razorpayPaymentId = razorpay_payment_id;
            
            await mongoOrder.save();
            res.status(200).json({ message: 'Payment verified successfully', orderId: mongoOrder._id });
        } else {
            res.status(404);
            throw new Error('Order not found in database');
        }
    } else {
        res.status(400);
        throw new Error('Invalid payment signature');
    }
};

export { createOrder, verifyPayment };
