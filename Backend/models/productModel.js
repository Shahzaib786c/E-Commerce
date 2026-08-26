import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price must be greater than 0"],
        },
        stock: {
            type: Number,
            required: [true, "Product stock is required"],
            min: [0, "Stock cannot be negative"],
        },
        image: {
            type: String,
            required: [true, "Product image is required"],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Product category is required"],
            ref: "Category",
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
export default Product;