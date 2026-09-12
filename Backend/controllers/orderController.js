import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { sendOrderConfirmation } from "../config/mailer.js";

// ---- ADDED (helper) ------------------------------------------------------
// Restores stock for items that were already deducted when a later step fails.
// $inc is atomic and additive, so this is safe to call even if other orders
// touched the same product in between.
async function restoreStock(deducted) {
    for (const entry of deducted) {
        try {
            await Product.updateOne(
                { _id: entry.product },
                { $inc: { stock: entry.quantity } }
            );
        } catch (err) {
            // Nothing useful to do here — log loudly so it can be reconciled by hand.
            console.error(
                `STOCK ROLLBACK FAILED for product ${entry.product} (qty ${entry.quantity}):`,
                err.message
            );
        }
    }
}
// --------------------------------------------------------------------------

export const createOrder = async (req, res) => {
    // Tracks what has actually been deducted, so any failure can be undone.
    const deducted = [];

    try {
        const { items, shippingAddress, paymentMethod, deliveryFee = 0 } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one item"
            });
        }
        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        // ---- ADDED (input hardening) -------------------------------------
        // deliveryFee arrives straight from the client. Without clamping, a
        // crafted request could send a negative value and reduce the total.
        const safeDeliveryFee = Math.max(0, Number(deliveryFee) || 0);

        // Merge duplicate lines for the same product. If the cart sends the
        // same product twice, the old loop validated each line against full
        // stock separately, so 2 x "last item in stock" could both pass.
        const mergedItems = new Map();
        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({
                    message: `Invalid product id: ${item.product}`
                });
            }

            const qty = Number(item.quantity);
            if (!Number.isInteger(qty) || qty < 1) {
                return res.status(400).json({
                    message: "Quantity must be a whole number of at least 1"
                });
            }

            const key = String(item.product);
            mergedItems.set(key, (mergedItems.get(key) || 0) + qty);
        }
        // -------------------------------------------------------------------

        // ---- CHANGED (pass 1 of 2: validate only, write nothing) ----------
        // Previously this loop deducted stock and saved each product as it
        // went. If anything later threw — Order.create(), a dropped connection
        // — that stock was gone permanently with no order to show for it.
        // This pass now only reads and builds the line items.
        let itemsTotal = 0;
        const orderItems = [];

        for (const [productId, quantity] of mergedItems) {
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${productId}`
                });
            }
            if (product.isActive === false) {
                return res.status(400).json({
                    message: `${product.name} is no longer available`
                });
            }
            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Available: ${product.stock}`
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                // Price is read from the DB, never from the client.
                price: product.price,
                quantity,
            });

            itemsTotal += product.price * quantity;
        }
        // -------------------------------------------------------------------

        // ---- CHANGED (pass 2: atomic deduction) ---------------------------
        // findOneAndUpdate with a stock guard reads and writes in ONE database
        // operation. The old read-then-save pattern had a race: two customers
        // buying the last unit simultaneously could both pass the check above
        // and both save, driving stock negative. The { stock: { $gte } } filter
        // makes the update itself fail rather than the check.
        for (const line of orderItems) {
            const updated = await Product.findOneAndUpdate(
                { _id: line.product, stock: { $gte: line.quantity } },
                { $inc: { stock: -line.quantity } },
                { new: true }
            );

            if (!updated) {
                // Someone took the stock between pass 1 and now.
                await restoreStock(deducted);
                return res.status(409).json({
                    message: `${line.name} just went out of stock. Please review your cart.`
                });
            }

            deducted.push({ product: line.product, quantity: line.quantity });
        }
        // -------------------------------------------------------------------

        let order;
        try {
            order = await Order.create({
                user: req.user._id,
                items: orderItems,
                totalAmount: itemsTotal + safeDeliveryFee,
                deliveryFee: safeDeliveryFee,
                shippingAddress,
                paymentMethod,
                orderStatus: "pending",
                // orderNumber is generated by the schema default — do not set it here.
            });
        } catch (orderError) {
            // ---- ADDED (rollback) -----------------------------------------
            // This is the exact case that was silently destroying inventory.
            // The order failed, so put every unit back before surfacing the error.
            await restoreStock(deducted);
            throw orderError;
            // ---------------------------------------------------------------
        }

        // Email must never fail the order — already correct in your version.
        try {
            await sendOrderConfirmation({
                toEmail: req.user.email,
                customerName: req.user.name,
                order,
            });
        } catch (emailError) {
            console.error("Failed to send order confirmation email:", emailError.message);
        }

        res.status(201).json(order);
    } catch (error) {
        console.error("createOrder failed:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Server error", error: error.message
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Server error", error: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        // ---- ADDED (guard) -------------------------------------------------
        // An invalid id string made findById throw a CastError, which fell
        // through to the 500 handler. A malformed id is a client error.
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid order id" });
        }
        // ---------------------------------------------------------------------

        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // ---- CHANGED (null safety) -----------------------------------------
        // Was: order.user._id.toString() — throws if the user was deleted,
        // because populate() leaves order.user as null rather than an object.
        const ownerId = order.user?._id || order.user;
        const isOwner = ownerId?.toString() === req.user._id.toString();
        // ---------------------------------------------------------------------

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "Not authorized to view this order"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Server error", error: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        // ---- ADDED (validation) --------------------------------------------
        // findByIdAndUpdate with runValidators does catch a bad enum value, but
        // checking here returns a clearer message than a Mongoose ValidationError.
        const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
        if (!allowed.includes(orderStatus)) {
            return res.status(400).json({
                message: `orderStatus must be one of: ${allowed.join(", ")}`
            });
        }
        // ---------------------------------------------------------------------

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // ---- ADDED (restore stock on cancellation) -------------------------
        // Cancelling previously left the deducted stock unrecoverable, so
        // inventory drifted low with every cancelled order. The wasCancelled
        // check prevents a double restore if an admin sets "cancelled" twice.
        const wasCancelled = order.orderStatus === "cancelled";

        if (orderStatus === "cancelled" && !wasCancelled) {
            await restoreStock(
                order.items.map((line) => ({
                    product: line.product,
                    quantity: line.quantity,
                }))
            );
        }
        // ---------------------------------------------------------------------

        order.orderStatus = orderStatus;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error("updateOrderStatus failed:", error);
        res.status(500).json({
            message: "Server error", error: error.message
        });
    }
};