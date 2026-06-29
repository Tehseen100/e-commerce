const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || [];

    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors
    });
};

export { errorHandler };