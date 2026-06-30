import { z } from "zod";
import { ApiError } from "../utils/apiError.js";

const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return new ApiError(422, "Validation failed", error)
        }

        next(error);
    }
}

export { validateBody }