import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import cloudinary from "cloudinary";

//generate tokens
const generateTokens = async (userId, next) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        return next(new ApiError(500, "Token generation failed"));
    }
};

//register user
const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    if (
        [username, email, password, role].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        return next(new ApiError(400, "Please enter the required fields"));
    }

    if (!validator.isEmail(email)) {
        return next(new ApiError(400, "Please enter a valid email"));
    }

    if (username.length < 3 || username.length > 30) {
        return next(
            new ApiError(400, "Username must be between 3 and 30 characters")
        );
    }

    if (password.length < 8 || password.length > 30) {
        return next(
            new ApiError(400, "Password must be between 8 and 30 characters")
        );
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        return next(new ApiError(409, "User with email already exists"));
    }

    let avatar;
    if (req.file) {
        try {
            avatar = await uploadToCloudinary(req.file?.path);
            if (!avatar) {
                return next(new ApiError(400, "Failed to upload avatar file"));
            }
        } catch (error) {
            return next(new ApiError(500, "Failed to upload avatar"));
        }
    } else {
        return next(
            new ApiError(400, "Avatar file is missing or not uploaded")
        );
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
        return next(new ApiError(500, "User registration failed"));
    }

    const { accessToken, refreshToken } = await generateTokens(
        isUserCreated._id
    );

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        sameSite: "None",
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        sameSite: "None",
    };

    const checkTokenOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        sameSite: "None",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("checkToken", true, checkTokenOptions)
        .json(
            new ApiResponse(200, isUserCreated, "User registered successfully")
        );
});

//login user
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => !field || field.trim() === "")) {
        return next(new ApiError(400, "Please enter the required fields"));
    }

    if (!validator.isEmail(email)) {
        return next(new ApiError(400, "Please Enter a valid Email"));
    }

    const isUserExists = await User.findOne({ email }).select("+password");

    if (!isUserExists) {
        return next(new ApiError(404, "User does not exist or Invalid email"));
    }

    const isPasswordValid = await isUserExists.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid email or password"));
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
        sameSite: "None",
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        sameSite: "None",
    };

    const checkTokenOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        sameSite: "None",
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

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .clearCookie("checkToken", { ...cookieOptions, httpOnly: false })
        .json(
            new ApiResponse(
                200,
                {},
                `User: ${req.user.username} logged out successfully`
            )
        );
});

//get current user
const getCurrentUser = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, "User not authenticated"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        );
});

//forgot password
const forgotPassword = asyncHandler(async (req, res, next) => {
    const email = req.body?.email;

    if (!email) {
        return next(new ApiError(400, "Please enter your email."));
    }

    if (!validator.isEmail(email)) {
        return next(new ApiError(400, "Please enter a valid email."));
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

    const resetPasswordUrl = `${process.env.CLIENT_URL || "https://shoplynk.vercel.app"}/password/reset/${resetToken}`;

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

        return next(
            new ApiError(
                500,
                error.message ||
                "Failed to send reset email. Please try again later."
            )
        );
    }
});

//reset password
const resetPassword = asyncHandler(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new ApiError(400, "Please enter both passwords"));
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
        return next(new ApiError(400, "Invalid or expired reset token."));
    }

    if (password !== confirmPassword) {
        return next(new ApiError(400, "Passwords do not match."));
    }

    if (password.length > 30 || password.length < 8) {
        return next(
            new ApiError(400, "Password must be between 8 and 30 characters.")
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
        sameSite: "None",
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        sameSite: "None",
    };

    const checkTokenOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        sameSite: "None",
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
const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(
            new ApiError(400, "Both old and new passwords are required")
        );
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        return next(new ApiError(400, "Invalid old password"));
    }

    if (oldPassword === newPassword) {
        return next(
            new ApiError(
                400,
                "New password cannot be the same as the old password."
            )
        );
    }

    if (newPassword.length > 30 || newPassword.length < 8) {
        return next(
            new ApiError(
                400,
                "Password length must be between 8 and 30 characters"
            )
        );
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password updated successfully"));
});

//update profile
const updateProfile = asyncHandler(async (req, res, next) => {
    const { username, email } = req.body;

    if ([username, email].some((field) => !field || field.trim() === "")) {
        return next(new ApiError(400, "Both username and email are required"));
    }

    if (!validator.isEmail(email)) {
        return next(new ApiError(400, "Please enter a valid email address"));
    }

    if (username.length > 30 || username.length < 3) {
        return next(
            new ApiError(400, "Username must be between 3 and 30 characters")
        );
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ApiError(404, "User not found"));
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
            return next(new ApiError(500, "Failed to upload new avatar"));
        }
    } else {
        return next(
            new ApiError(400, "Avatar file is missing or not uploaded")
        );
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
        }
    );

    if (!updatedUser) {
        return next(new ApiError(500, "Failed to update user profile"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "Profile updated successfully.")
        );
});

//update from buyer to seller role
const updateUserRole = asyncHandler(async (req, res, next) => {
    const { username, email } = req.body;

    if ([username, email].some((field) => !field || field.trim() === "")) {
        return next(new ApiError(400, "Username and email are required"));
    }

    if (!validator.isEmail(email)) {
        return next(new ApiError(400, "Please Enter a valid Email"));
    }

    if (username.length > 30 || username.length < 3) {
        return next(
            new ApiError(400, "Username must be between 3 and 30 characters")
        );
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        return next(
            new ApiError(404, `User with ID ${req.user?._id} not found.`)
        );
    }

    if (user.role !== "buyer") {
        return next(
            new ApiError(403, "Only buyers can upgrade to seller role.")
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        { username, email, role: "seller" },
        { new: true, runValidators: true, select: "-password -refreshToken" }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "User role updated successfully")
        );
});

//delete account
const deleteUserProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        if (user.avatar && user.avatar.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        const sellerProducts = await Product.find({ owner: userId });

        const publicIds = sellerProducts.flatMap((product) =>
            product.images.map((image) => image.public_id)
        );

        if (publicIds.length > 0) {
            await deleteImagesFromCloudinary(publicIds);
        }

        await Product.deleteMany({ owner: userId });
        await Order.deleteMany({ user: userId });

        await Order.updateMany(
            {
                "orderItems.product": {
                    $in: sellerProducts.map((product) => product._id),
                },
            },
            {
                $pull: {
                    orderItems: {
                        product: {
                            $in: sellerProducts.map((product) => product._id),
                        },
                    },
                },
            }
        );

        await Order.deleteMany({ orderItems: { $size: 0 } });

        await Product.updateMany(
            { "reviews.userId": userId },
            { $pull: { reviews: { userId: userId } } }
        );

        await User.findByIdAndDelete(userId);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        };

        return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .clearCookie("checkToken", { ...cookieOptions, httpOnly: false })
            .json(
                new ApiResponse(200, {}, "User account deleted successfully")
            );
    } catch (error) {
        return next(
            new ApiError(
                500,
                error.message || "An error occurred while deleting the account"
            )
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
    updateUserRole,
    deleteUserProfile,
};
