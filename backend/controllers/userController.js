import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            res.status(401);
            throw new Error('Please verify your email first');
        }
        const token = generateToken(res, user._id);

        const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
        const ipAddress = req.ip || 'Unknown IP';
        await Session.create({
            userId: user._id,
            token,
            deviceInfo,
            ipAddress,
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists && userExists.isVerified) {
        res.status(400);
        throw new Error('User already exists');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user;
    if (userExists && !userExists.isVerified) {
        userExists.name = name;
        userExists.password = password;
        userExists.phone = phone;
        userExists.otp = otp;
        userExists.otpExpires = otpExpires;
        user = await userExists.save();
    } else {
        user = await User.create({
            name,
            email,
            password,
            phone,
            otp,
            otpExpires,
        });
    }

    if (user) {
        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification OTP',
                message: `Your OTP for email verification is ${otp}`,
                otp,
            });

            return res.status(201).json({
                message: 'OTP sent to your email. Please verify to complete registration.',
                email: user.email,
            });
        } catch (error) {
            console.error('Email send error:', error);
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            res.status(500);
            throw new Error('Email could not be sent');
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = async (req, res) => {
    let token = req.cookies?.jwt;

    if (token) {
        await Session.findOneAndUpdate(
            { token, isActive: true },
            { isActive: false, logoutTime: new Date() }
        );
    }

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        if (req.body.address) {
            user.address = {
                addressLine: req.body.address.addressLine || (user.address ? user.address.addressLine : ''),
                city: req.body.address.city || (user.address ? user.address.city : ''),
                state: req.body.address.state || (user.address ? user.address.state : ''),
                pincode: req.body.address.pincode || (user.address ? user.address.pincode : ''),
            };
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
};

// @desc    Verify OTP
// @route   POST /api/users/verify
// @access  Public
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
        email, 
        otp, 
        otpExpires: { $gt: Date.now() } 
    });

    if (user) {
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken(res, user._id);

        const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
        const ipAddress = req.ip || 'Unknown IP';
        await Session.create({
            userId: user._id,
            token,
            deviceInfo,
            ipAddress,
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }
};

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    verifyOTP
};
