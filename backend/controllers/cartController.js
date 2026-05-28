import Cart from '../models/cartModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }
    res.status(200).json({
        ...cart.toObject(),
        cartItems: cart.cartItems.map(x => ({...x.toObject(), _id: x.product}))
    });
};

// @desc    Update user cart (sync)
// @route   POST /api/cart
// @access  Private
const updateCart = async (req, res) => {
    const { cartItems } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
        cart.cartItems = cartItems.map(item => ({
            ...item, 
            product: item._id || item.product, 
            _id: undefined // Don't attempt to reuse frontend generated IDs for subdocs
        }));
        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } else {
        const newCart = await Cart.create({
            user: req.user._id,
            cartItems: cartItems.map(item => ({
                ...item, 
                product: item._id || item.product,
                _id: undefined
            }))
        });
        res.status(201).json(newCart);
    }
};

export { getCart, updateCart };
