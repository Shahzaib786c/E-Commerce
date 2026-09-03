import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

export const createCategory = async (req, res) => {
    try {
        const { categoryName, slug, icon, description } = req.body;

        if (!categoryName || !slug) {
            return res.status(400).json({ message: "Category name and slug are required" });
        }

        const category = await Category.create({ categoryName, slug, icon, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find(
            {
                isActive: true
            });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const getAllCategoriesAdmin = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json(
                {
                    message: "Category not found"
                });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true,
            });
        if (!category) {
            return res.status(404).json(
                {
                    message: "Category not found"
                });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const updateCategoryStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json(
                {
                    message: "isActive must be true or false"
                });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json(
                {
                    message: "Category not found"
                });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const productsUsingCategory = await Product.findOne(
            {
                category: req.params.id
            });
        if (productsUsingCategory) {
            return res.status(400).json(
                {
                    message: "Cannot delete category while products are still assigned to it",
                });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json(
                {
                    message: "Category not found"
                });
        }
        res.status(200).json(
            {
                message: "Category deleted successfully"
            });
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};