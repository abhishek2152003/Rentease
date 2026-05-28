import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    verifyOTP
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validations/userValidations.js';

const router = express.Router();

router.route('/').post(validateRequest(registerSchema), registerUser).get(protect, admin, getUsers);
router.post('/logout', logoutUser);
router.post('/login', validateRequest(loginSchema), authUser);
router.post('/verify', verifyOTP);
router.route('/profile').get(protect, getUserProfile).put(protect, validateRequest(updateProfileSchema), updateUserProfile);

export default router;
