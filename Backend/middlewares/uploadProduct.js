import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "cuddle-co/products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const uploadProduct = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadProduct;