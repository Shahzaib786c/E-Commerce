import express from 'express';
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllCategoriesAdmin,
     updateCategoryStatus
} from '../controllers/categoryController.js';

import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/admin/all', protect, isAdmin, getAllCategoriesAdmin); // must come BEFORE /:id
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, isAdmin, createCategory);
router.put('/:id/status', protect, isAdmin, updateCategoryStatus);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

export default router;