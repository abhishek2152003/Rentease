import express from 'express';
const router = express.Router();
import {
    createContactMessage,
    getContactMessages,
    updateContactStatus,
    deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { contactFormSchema } from '../validations/contactValidations.js';

router.route('/').post(validateRequest(contactFormSchema), createContactMessage).get(protect, admin, getContactMessages);
router
    .route('/:id')
    .put(protect, admin, updateContactStatus)
    .delete(protect, admin, deleteContactMessage);

export default router;
