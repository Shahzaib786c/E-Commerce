import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  updateProductStatus,
} from "../controllers/productController.js";
import uploadProduct from "../middlewares/uploadProduct.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// Wraps the multer/Cloudinary upload step so any error inside it is actually
// caught and shown, instead of silently crashing past Express's normal flow.
function handleUpload(req, res, next) {
  uploadProduct.array("images", 5)(req, res, (err) => {
    if (err) {
      console.error("Upload middleware error:", err);
      return res.status(400).json({ message: "Upload failed", error: err.message });
    }
    next();
  });
}

router.get("/", getProducts);
router.get("/admin/all", protect, isAdmin, getAllProductsAdmin);
router.get("/:id", getProductById);
router.post("/", protect, isAdmin, handleUpload, createProduct);
router.put("/:id", protect, isAdmin, handleUpload, updateProduct);
router.put("/:id/status", protect, isAdmin, updateProductStatus);
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;