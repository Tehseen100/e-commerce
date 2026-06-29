import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    res.status(201).json(
        new ApiResponse(201, "User registered successfully", null)
    )
});

export { registerUser };