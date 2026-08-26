import express from 'express';
import {
    createPayment,
    getPaymentByOrder,
    updatePaymentStatus,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.post('/', protect, isAdmin, createPayment);
router.get('/order/:orderId', protect, isAdmin, getPaymentByOrder);
router.put('/:id/status', protect, isAdmin, updatePaymentStatus); 

export default router;