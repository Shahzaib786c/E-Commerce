import ContactMessage from "../models/contactModel.js";
import { sendContactNotification } from "../config/mailer.js";

export const submitContactMessage = async (req, res) => {
    try {
        const { name, email, message, website } = req.body;
        // "website" is our honeypot field — real users never see or fill it.
        // If it has a value, this was almost certainly a bot. Pretend success
        // (don't tell the bot it was caught) but do nothing.
        if (website) {
            return res.status(201).json(
                {
                    message: "Message sent successfully"
                });
        }

        if (!name || !email || !message) {
            return res.status(400).json(
                {
                    message: "All fields are required"
                });
        }

        const contactMessage = await ContactMessage.create(
            {
                name, email, message
            });

        try {
            await sendContactNotification(
                {
                    name, email, message
                });
        } catch (emailError) {
            console.error("Failed to send contact email:", emailError.message);
        }

        res.status(201).json(
            {
                message: "Message sent successfully"
            });
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const getContactMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};

export const updateMessageStatus = async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { status: "responded" },
            { new: true }
        );
        if (!message) {
            return res.status(404).json(
                {
                    message: "Message not found"
                });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message
            });
    }
};