import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
} from '../controllers/orderController.js';

import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { getAllOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/admin/all', protect, isAdmin, getAllOrders);
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

export default router;