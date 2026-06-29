import { ApiError } from "../utils/apiError.js";

const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};

export { notFound };  