import { Resend } from "resend";

const FROM_ADDRESS = "Cuddle & Co <onboarding@resend.dev>";

export async function sendContactNotification({ name, email, message }) {
    const resend = new Resend(process.env.RESEND_API_KEY); // created here, not at top of file

    await resend.emails.send({
        from: FROM_ADDRESS,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New contact form message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
}

export async function sendOrderConfirmation({ toEmail, customerName, order }) {
    const resend = new Resend(process.env.RESEND_API_KEY); // created here too

    const itemsList = order.items
        .map((item) => `  - ${item.name} x${item.quantity} — $${(item.price * item.quantity).toLocaleString()}`)
        .join("\n");

    await resend.emails.send({
        from: FROM_ADDRESS,
        to: toEmail,
        subject: `Order confirmed — #${order._id.toString().slice(-6).toUpperCase()}`,
        text: `Hi ${customerName},

Thanks for your order! Here's a quick summary:

Order #${order._id.toString().slice(-6).toUpperCase()}

Items:
${itemsList}

Delivery: ${order.deliveryFee === 0 ? "Free" : `$${order.deliveryFee}`}
Total: $${order.totalAmount.toLocaleString()}
Payment method: ${order.paymentMethod}

Shipping to:
${order.shippingAddress.fullName}
${order.shippingAddress.street}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode || ""}

We'll notify you again once your order ships.

Thanks for shopping with Cuddle & Co!`,
    });
}