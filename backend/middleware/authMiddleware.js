import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';

// Protect routes
const protect = async (req, res, next) => {
    let token;

    // Read the JWT from the cookie
    token = req.headers?.cookie?.split('jwt=')[1]?.split(';')[0]; // simple cookie parsing or better to use cookie-parser later

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const session = await Session.findOne({ token, isActive: true });
            if (!session) {
                res.status(401);
                throw new Error('Session invalid or expired');
            }

            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        next(new Error('Not authorized as admin'));
    }
};

export { protect, admin };
