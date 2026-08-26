// Catches requests to routes that don't exist at all
export const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error); // passes it forward to errorHandler below
};

// Catches every error thrown/passed anywhere in the app
export const errorHandler = (err, req, res, next) => {
    // If a controller already set a status code, keep it; otherwise default to 500
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Mongoose bad ObjectId (e.g. someone requests /api/products/123 with an invalid id)
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "Resource not found";
    }

    // Mongoose validation errors (missing required field, failed min/max, etc.)
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    // Duplicate key error (e.g. email already registered)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};