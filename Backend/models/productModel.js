// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: [true, "Product name is required"],
//         },
//         description: {
//             type: String,
//         },
//         price: {
//             type: Number,
//             required: [true, "Product price is required"],
//             min: [0, "Price must be greater than 0"],
//         },
//         stock: {
//             type: Number,
//             required: [true, "Product stock is required"],
//             min: [0, "Stock cannot be negative"],
//         },
//         image: {
//             type: String,
//             required: [true, "Product image is required"],
//         },
//         category: {
//             type: mongoose.Schema.Types.ObjectId,
//             required: [true, "Product category is required"],
//             ref: "Category",
//         },

//     },
//     {
//         timestamps: true,
//     }
// );

// export default mongoose.model("Product", productSchema);

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
    images: {
      type: [String], // now an array — supports multiple product photos
      required: [true, "At least one product image is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product category is required"],
      ref: "Category",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    variants: {
      type: [String], // e.g. ["Small", "Medium", "Large"]
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
