import express from 'express';
import { getSessions, deleteSession } from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getSessions);

router.route('/:id')
    .delete(protect, deleteSession);

export default router;
