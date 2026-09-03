import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin
} from '../controllers/productController.js';
import uploadProduct from "../middlewares/uploadProductMiddleware.js";

import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/admin/all', protect, isAdmin, getAllProductsAdmin);
router.get('/:id', getProductById);
router.post('/', protect, isAdmin, uploadProduct.single("image"), createProduct);
router.put('/:id', protect, isAdmin, uploadProduct.single("image"), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

export default router;