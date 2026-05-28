import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { createProductSchema, updateProductSchema, reviewSchema } from '../validations/productValidations.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, validateRequest(createProductSchema), createProduct);
router.route('/:id').get(getProductById).put(protect, admin, validateRequest(updateProductSchema), updateProduct).delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, validateRequest(reviewSchema), createProductReview);

export default router;
