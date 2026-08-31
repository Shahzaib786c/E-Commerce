import multer from "multer";
import path from "path";
import fs from "fs";

// 🟢 FIX 1: Corrected "ifs" typo to "fs" so your folder checks execute perfectly
const uploadDir = "uploads/products/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".jfif"];

    // 🟢 FIX 2: Relaxed the check to accept valid extensions OR valid mimetypes 
    // This allows Unsplash and downloaded web graphics to pass through safely
    if (allowedExtensions.includes(extension) || file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const uploadProduct = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});

export default uploadProduct;
