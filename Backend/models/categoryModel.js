import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: [true, "Category name is required"],
        },
        slug: {
            type: String,
            required: [true, "Category slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        icon: {
            type: String, // Tabler icon class, e.g. "ti-paw"
            default: "",
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);