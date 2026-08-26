import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Everything here requires login — no guest checkout
router.post('/', protect, isAdmin, createOrder);
router.get('/my-orders', protect, isAdmin, getMyOrders);
router.get('/:id', protect, isAdmin, getOrderById);
router.put('/:id/status', protect, isAdmin, updateOrderStatus); // admin-only, once isAdmin exists

export default router;