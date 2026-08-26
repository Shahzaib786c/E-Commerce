import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";

export const createPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, amountPaid } = req.body;

        if (!orderId || !paymentMethod || !amountPaid) {
            return res.status(400).json(
                {
                    message: "Missing required payment fields"
                });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json(
                {
                    message: "Order not found"
                });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json(
                {
                    message: "Not authorized to pay for this order"
                });
        }

        const existingPayment = await Payment.findOne({ order: orderId });
        if (existingPayment) {
            return res.status(400).json(
                {
                    message: "Payment already exists for this order"
                });
        }

        if (amountPaid !== order.totalAmount) {
            return res.status(400).json(
                {
                    message: "Amount paid does not match order total"
                });
        }

        const payment = await Payment.create(
            {
                orderId: orderId,
                paymentMethod,
                paymentStatus: "completed",
                transactionDate: new Date(),
                amountPaid,
            });

        order.orderStatus = "confirmed";
        await order.save();

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const getPaymentByOrder = async (req, res) => {
    try {
        const payment = await Payment.findOne(
            {
                order: req.params.orderId
            }).populate(
                "order",
                "totalAmount orderStatus"
            );

        if (!payment) {
            return res.status(404).json(
                {
                    message: "Payment not found for this order"
                });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true, runValidators: true }
        );

        if (!payment) {
            return res.status(404).json(
                {
                    message: "Payment not found"
                });
        }

        if (paymentStatus === "refunded") {
            await Order.findByIdAndUpdate(payment.order,
                {
                    orderStatus: "cancelled"
                });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};