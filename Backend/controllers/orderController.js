import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";


export const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json(
                {
                    message: "Order must contain at least one item"
                });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json(
                    {
                        message: `Product not found: ${item.product}`
                    });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json(
                    {
                        message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
                    });
            }
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
            totalAmount += product.price * item.quantity;
            product.stock -= item.quantity;
            await product.save();
        }
        const order = await Order.create(
            {
                user: req.user._id,
                items: orderItems,
                totalAmount,
                orderStatus: "pending",
            });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find(
            {
                user: req.user._id
            }).sort(
                {
                    createdAt: -1
                });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) {
            return res.status(404).json(
                {
                    message: "Order not found"
                });
        }
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json(
                {
                    message: "Not authorized to view this order"
                });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        );
        if (!order) {
            return res.status(404).json(
                {
                    message: "Order not found"
                });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};