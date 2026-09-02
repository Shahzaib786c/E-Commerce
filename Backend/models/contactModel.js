import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            maxlength: [2000, "Message is too long"],
        },
        status: {
            type: String,
            enum: ["new", "responded"],
            default: "new",
        },
    },
    { timestamps: true }
);

export default mongoose.model("ContactMessage", contactSchema);