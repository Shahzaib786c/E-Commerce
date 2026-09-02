import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            category,
            rating,
            isNewArrival,
            isBestseller,
            variants,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" });
        }

        if (!name || !price || !stock || !category) {
            return res.status(400).json({ message: "Missing required product fields" });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        const imageUrl = `/uploads/products/${req.file.filename}`;

        // form-data sends everything as strings — split "Small,Medium,Large" into a real array
        const variantsArray = variants
            ? variants.split(",").map((v) => v.trim()).filter(Boolean)
            : [];

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            images: [imageUrl],
            category,
            rating,
            isNewArrival,
            isBestseller,
            variants: variantsArray,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const products = await Product.find(filter).populate("category", "categoryName slug");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};


export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "categoryName");
        if (!product) {
            return res.status(404).json(
                {
                    message: "Product not found"
                });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message

            });
    }
};

export const updateProduct = async (req, res) => {
    try {
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const updateData = { ...req.body };

        // Only overwrite the image if a new file was actually uploaded this time
        if (req.file) {
            updateData.images = [`/uploads/products/${req.file.filename}`];
        }
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json(
                {
                    message: "Product not found"

                });
        }
        res.status(200).json(
            {
                message: "Product deleted successfully"

            });
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message

            });
    }
};