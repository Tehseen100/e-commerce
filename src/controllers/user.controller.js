import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, removeLocalFile } from "../utils/cloudinary.js";
import { generateTokens } from "../utils/jwt.js";


const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body

    const userExists = await User.exists({
        $or: [{ username }, { email }]
    });

    if (userExists) {
        removeLocalFile(req.file?.path);
        throw new ApiError(409, "User already exists")
    }

    const avatar = req.file && await uploadOnCloudinary(req.file.path);

    const user = await User.create({
        fullName,
        username,
        email,
        password,
        avatar: avatar && {
            url: avatar.secure_url,
            public_id: avatar.public_id,
        }
    });

    const { accessToken, refreshToken } = generateTokens(user?._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const createdUser = await User.findById(user?._id).lean();

    return res
        .status(201)
        .cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                201,
                { user: createdUser, accessToken },
                "User registered successfully"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    const user = await User.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials")
    }

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user?._id).lean();

    return res
        .status(200)
        .cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            returnDocument: "after"
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(
            new ApiResponse(200, {}, "User logged out")
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        console.log("Decoded refresh token error:", error);
        throw new ApiError(403, "Invalid or expired refresh token")
    }

    const user = await User.findById(decodedToken?._id).select("+refreshToken");
    // console.log({ user })

    if (!user) {
        throw new ApiError(403, "Invalid or expired refresh token")
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(403, "Invalid or expired refresh token")
    }

    const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    } = generateTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                200,
                { accessToken: newAccessToken },
                "Access token refreshed")
        );
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};