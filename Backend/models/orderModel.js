import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Product reference is required"],
            ref: "Product",
        },
        name: {
            type: String,
            required: [true, "Product name is required"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be at least 1"],
        },
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        deliveryFee: { type: Number, default: 0 },
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String },
        },
        paymentMethod: {
            type: String,
            enum: ["safepay", "cod"],
            required: true,
        },
        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);
export default mongoose.model("Order", orderSchema);