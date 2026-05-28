import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const keyword = req.query.keyword
        ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
        : {};

    // Only show active products to public users (Keep out of stock visible so they say "Out of Stock")
    const queryFilter = req.query.isAdmin === 'true' ? { ...keyword } : { ...keyword, isActive: true };

    let query = Product.find(queryFilter);

    // Sorting & Limiting
    if (req.query.limit) {
        query = query.sort({ createdAt: -1 }).limit(Number(req.query.limit));
    }

    const products = await query;
    res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    if (!req.body) {
        res.status(400);
        throw new Error('Req.body is fundamentally undefined');
    }

    const product = new Product({
        name: req.body.name || 'Sample name',
        priceDaily: req.body.priceDaily || 0,
        priceMonthly: req.body.priceMonthly || 0,
        user: req.user._id,
        images: req.body.images && req.body.images.length > 0 ? req.body.images : ['https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&w=800&q=80'],
        category: req.body.category || 'Uncategorized',
        stock: req.body.stock || 0,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        isAvailable: Number(req.body.stock || 0) > 0,
        numReviews: 0,
        description: req.body.description || 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    if (!req.body) {
        res.status(400);
        throw new Error('Req.body is undefined');
    }
    
    const { name, priceDaily, priceMonthly, description, images, category, stock, isActive } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.priceDaily = priceDaily;
        product.priceMonthly = priceMonthly;
        product.description = description;
        product.images = images;
        product.category = category;
        product.stock = stock;
        product.isAvailable = Number(stock) > 0;
        if (isActive !== undefined) product.isActive = isActive;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        // Verify if user ordered this and it was delivered
        const Order = (await import('../models/orderModel.js')).default;
        const orders = await Order.find({ user: req.user._id });
        const hasPurchasedAndDelivered = orders.some(order => 
            order.status === 'Delivered' && 
            order.orderItems.some(item => item.product.toString() === product._id.toString())
        );

        if (!hasPurchasedAndDelivered) {
            res.status(400);
            throw new Error('You can only review items you have successfully rented and received.');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added successfully' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
};
