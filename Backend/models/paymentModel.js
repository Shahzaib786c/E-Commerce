import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    transactionDate: {
        type: Date
    },
    amountPaid: {
        type: Number,
        required: true
    },
},
    {
        timestamps: true
    });

export default mongoose.model('Payment', paymentSchema);