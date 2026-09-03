import express from 'express';

import {
    submitContactMessage,
    getContactMessages,
    updateMessageStatus,
} from '../controllers/contactController.js';

import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { contactLimiter } from '../middlewares/contactRateLimit.js';

const router = express.Router();

router.post('/', contactLimiter, submitContactMessage); // public — rate limited
router.get('/', protect, isAdmin, getContactMessages); // admin only
router.put('/:id/status', protect, isAdmin, updateMessageStatus); // admin only

export default router;