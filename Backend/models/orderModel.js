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
        // ---- ADDED --------------------------------------------------------
        // The database already carries a unique index named "orderNumber_1"
        // from an earlier version of this schema. The field itself was removed
        // from the code but Mongoose never drops indexes it didn't create this
        // run, so every order was inserting with orderNumber: null and
        // colliding with the one document that already held null.
        //
        // Rather than drop the index and lose order numbers entirely, the field
        // is restored properly. The default runs on every insert, so the value
        // can never be null again.
        //
        // Format: ORD-<ms timestamp>-<4 random digits>. Not sequential, but it
        // needs no counters collection — which is exactly the kind of thing
        // that goes missing during a database migration.
        orderNumber: {
            type: String,
            unique: true,
            required: true,
            default: () =>
                `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        },
        // -------------------------------------------------------------------

        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        deliveryFee: { type: Number, default: 0 },
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: {
                type: String,
                required: true,
                match: [/^[\d\s\-+()]{7,20}$/, "Please provide a valid phone number"],
            },
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