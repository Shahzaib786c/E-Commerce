import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

// @desc   Create a new product
// @route  POST /api/products
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, image, category } = req.body;

        if (!name || !price || !stock || !image || !category) {
            return res.status(400).json({ message: "Missing required product fields" });
        }

        // Make sure the category actually exists before linking to it
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            image,
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Get all products (optionally filter by category)
// @route  GET /api/products
export const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const products = await Product.find(filter).populate("category", "categoryName");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Get a single product by id
// @route  GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "categoryName");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Update a product
// @route  PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc   Delete a product
// @route  DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};