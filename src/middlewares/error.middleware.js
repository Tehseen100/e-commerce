const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    // Mongoose bad ObjectId
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 422;
        errors = Object.values(err.errors).map(e => e.message);
        message = "Validation failed";
    }

    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors,
    });
}

export { errorHandler }