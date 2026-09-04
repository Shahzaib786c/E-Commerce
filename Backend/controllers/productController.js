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
      return res.status(400).json({
        message: "Missing required product fields",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;

    // form-data sends everything as strings — split "Small,Medium,Large" into a real array
    const variantsArray = variants
      ? variants
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
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
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 8 } = req.query;

    let filter = { isActive: true }; // product's OWN toggle must be true

    if (category) {
      const requestedCategory = await Category.findOne({
        slug: category,
        isActive: true,
      });
      if (!requestedCategory) {
        return res
          .status(200)
          .json({ products: [], totalCount: 0, totalPages: 0, currentPage: 1 });
      }
      filter.category = requestedCategory._id;
    } else {
      const inactiveCategories = await Category.find({
        isActive: false,
      }).select("_id");
      filter.category = { $nin: inactiveCategories.map((c) => c._id) };
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "popular") sortOption = { rating: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "categoryName slug icon")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Activate or deactivate a single product (admin only)
// @route  PUT /api/products/:id/status
export const updateProductStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "isActive must be true or false" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true },
    ).populate("category", "categoryName slug icon");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "categoryName",
    );
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "categoryName slug icon")
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(404).json({
          message: "Category not found",
        });
      }
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.images = [`/uploads/products/${req.file.filename}`];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
