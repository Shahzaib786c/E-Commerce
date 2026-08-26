import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc   Create a new order
// @route  POST /api/orders
// @access Private (requires login)
export const createOrder = async (req, res) => {
    try {
        const { items } = req.body; // items: [{ product: "id", quantity: 2 }, ...]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item" });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Loop through each cart item, verify it, and build the embedded snapshot
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,       // snapshot
                price: product.price,     // snapshot — frozen at time of order
                quantity: item.quantity,
            });

            totalAmount += product.price * item.quantity;

            // Reduce stock now that the order is confirmed valid
            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            orderStatus: "pending",
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Get logged-in user's own orders
// @route  GET /api/orders/my-orders
// @access Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Get a single order by id
// @route  GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // A user can only view their own order (unless you add an admin check later)
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this order" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Update order status (e.g. admin marks as shipped)
// @route  PUT /api/orders/:id/status
// @access Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};