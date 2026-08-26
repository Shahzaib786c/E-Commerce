import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";

// @desc   Create a payment record for an order
// @route  POST /api/payments
// @access Private
export const createPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, amountPaid } = req.body;

        if (!orderId || !paymentMethod || !amountPaid) {
            return res.status(400).json({ message: "Missing required payment fields" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Only the order's own owner can pay for it
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to pay for this order" });
        }

        // Don't allow paying twice for the same order
        const existingPayment = await Payment.findOne({ order: orderId });
        if (existingPayment) {
            return res.status(400).json({ message: "Payment already exists for this order" });
        }

        // Guard against a mismatched amount (e.g. tampered frontend request)
        if (amountPaid !== order.totalAmount) {
            return res.status(400).json({ message: "Amount paid does not match order total" });
        }

        const payment = await Payment.create({
            orderId: orderId,
            paymentMethod,
            paymentStatus: "completed", // in a real gateway, this comes from the provider's response
            transactionDate: new Date(),
            amountPaid,
        });

        // Payment succeeded — move the order forward
        order.orderStatus = "confirmed";
        await order.save();

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Get payment details for a specific order
// @route  GET /api/payments/order/:orderId
// @access Private
export const getPaymentByOrder = async (req, res) => {
    try {
        const payment = await Payment.findOne({ order: req.params.orderId }).populate(
            "order",
            "totalAmount orderStatus"
        );

        if (!payment) {
            return res.status(404).json({ message: "Payment not found for this order" });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Update payment status (e.g. mark as refunded)
// @route  PUT /api/payments/:id/status
// @access Private/Admin
export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true, runValidators: true }
        );

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // If refunded, reflect that back on the order too
        if (paymentStatus === "refunded") {
            await Order.findByIdAndUpdate(payment.order, { orderStatus: "cancelled" });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};