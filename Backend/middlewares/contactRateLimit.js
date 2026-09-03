import rateLimit from "express-rate-limit";

export const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 contact submissions per window
    message: { message: "Too many messages sent. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
