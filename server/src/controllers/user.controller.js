import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import cloudinary from "cloudinary";

//generate tokens
const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

//register user
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    if (
        [username, email, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "Please enter the required fields");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please enter a valid email");
    }

    if (username.length < 3 || username.length > 30) {
        throw new ApiError(400, "Username must be between 3 and 30 characters");
    }

    if (password.length < 8 || password.length > 30) {
        throw new ApiError(400, "Password must be between 8 and 30 characters");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    let avatar;
    if (req.file) {
        try {
            avatar = await uploadToCloudinary(req.file.path);
            if (!avatar) {
                throw new ApiError(
                    400,
                    "Failed to upload avatar file to cloud"
                );
            }
        } catch (error) {
            throw new ApiError(
                500,
                error.message || "Failed to upload avatar file to cloud"
            );
        }
    } else {
        throw new ApiError(400, "Avatar file is missing or not uploaded");
    }

    const newUser = {
        username,
        email,
        password,
        avatar: {
            public_id: avatar.public_id,
            url: avatar.secure_url,
        },
        role: role ? role.toLowerCase() : "buyer",
    };

    const user = await User.create(newUser);

    const isUserCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!isUserCreated) {
        throw new ApiError(500, "User registration failed");
    }

    const { accessToken, refreshToken } = await generateTokens(
        isUserCreated._id
    );

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    };

    const checkTokenOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("checkToken", true, checkTokenOptions)
        .json(
            new ApiResponse(200, isUserCreated, "User registered successfully")
        );
});

//login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "Please enter the required fields");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please Enter a valid Email");
    }

    const isUserExists = await User.findOne({ email }).select("+password");

    if (!isUserExists) {
        throw new ApiError(404, "User does not exist or Invalid email");
    }

    const isPasswordValid = await isUserExists.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateTokens(
        isUserExists._id
    );

    const loggedInUser = await User.findById(isUserExists._id).select(
        "-password -refreshToken"
    );

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    };

    const checkTokenOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("checkToken", true, checkTokenOptions)
        .json(
            new ApiResponse(200, loggedInUser, "User logged in successfully")
        );
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
    };

    const checkTokenOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
    };

    return res
        .status(200)
        .clearCookie("accessToken", accessTokenOptions)
        .clearCookie("refreshToken", refreshTokenOptions)
        .clearCookie("checkToken", checkTokenOptions)
        .json(
            new ApiResponse(
                200,
                {},
                `User: ${req.user.username} logged out successfully`
            )
        );
});

//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        );
});

//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
    const email = req.body?.email;

    if (!email) {
        throw new ApiError(400, "Please enter your email.");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please enter a valid email.");
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "If this email exists, a password reset link will be sent."
                )
            );
    }

    const resetToken = user.getPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.CLIENT_URL}/password/reset/${resetToken}`;

    const message = `You requested a password reset. Please use the following link to reset your password: \n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore this email or update your password to ensure your account's security.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Recovery Request | ShopLynk",
            message,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    `Email sent to ${user.email} successfully`
                )
            );
    } catch (error) {
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save({ validateBeforeSave: false });

        throw new ApiError(
            500,
            error.message ||
            "Failed to send reset email. Please try again later."
        );
    }
});

//reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        throw new ApiError(400, "Please enter both passwords");
    }

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token.");
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match.");
    }

    if (password.length > 30 || password.length < 8) {
        throw new ApiError(
            400,
            "Password must be between 8 and 30 characters."
        );
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    user.password = password;
    user.refreshToken = refreshToken;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    };

    const checkTokenOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("checkToken", true, checkTokenOptions)
        .json(
            new ApiResponse(
                200,
                loggedInUser,
                "Password has been reset and user logged in successfully"
            )
        );
});

//update current password
const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required");
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(
            400,
            "New password cannot be the same as the old password."
        );
    }

    if (newPassword.length > 30 || newPassword.length < 8) {
        throw new ApiError(
            400,
            "Password length must be between 8 and 30 characters"
        );
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password updated successfully"));
});

//update profile
const updateProfile = asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    if ([username, email].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "Both username and email are required");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please enter a valid email address");
    }

    if (username.length > 30 || username.length < 3) {
        throw new ApiError(400, "Username must be between 3 and 30 characters");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.avatar && user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    let avatarLocalPath;
    if (req.file) {
        avatarLocalPath = req.file.path;
    }

    let avatar;
    if (avatarLocalPath) {
        avatar = await uploadToCloudinary(avatarLocalPath);

        if (!avatar) {
            throw new ApiError(500, "Failed to upload new avatar");
        }
    } else {
        throw new ApiError(400, "Avatar file is missing or not uploaded");
    }

    const newUserData = {
        username,
        email,
        avatar: {
            public_id: avatar.public_id,
            url: avatar.secure_url,
        },
    };

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        newUserData,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    if (!updatedUser) {
        throw new ApiError(500, "Failed to update user profile");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "Profile updated successfully.")
        );
});

//update from buyer to seller role
const updateUserRole = asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    if ([username, email].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "Username and email are required");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please Enter a valid Email");
    }

    if (username.length > 30 || username.length < 3) {
        throw new ApiError(400, "Username must be between 3 and 30 characters");
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, `User with ID ${req.user?._id} not found.`);
    }

    if (user.role !== "buyer") {
        throw new ApiError(403, "Only buyers can upgrade to seller role.");
    }

    user.username = username;
    user.email = email;
    user.role = "seller";

    await user.save({ runValidators: true });

    const updatedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "User role updated successfully")
        );
});

//delete account
const deleteUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (user.avatar && user.avatar.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        await User.findByIdAndDelete(userId);

        const accessTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
        };

        const checkTokenOptions = {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
        };

        res.clearCookie("accessToken", accessTokenOptions);
        res.clearCookie("refreshToken", refreshTokenOptions);
        res.clearCookie("checkToken", checkTokenOptions);

        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "User account deleted successfully")
            );
    } catch (error) {
        throw new ApiError(
            500,
            error.message || "An error occurred while deleting the account"
        );
    }
});

//renew access token
const renewAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid");
        }

        const { accessToken, newRefreshToken } = await generateTokens(user._id);

        const accessTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        };

        const checkTokenOptions = {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
            .cookie("checkToken", true, checkTokenOptions)
            .json(new ApiResponse(200, {}, "Access token refreshed"));
    } catch (error) {
        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
        };

        res.clearCookie("refreshToken", refreshTokenOptions);

        throw new ApiError(
            401,
            error?.message || "Invalid or expired refresh token"
        );
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    renewAccessToken,
    updateUserRole,
    deleteUserProfile,
};
