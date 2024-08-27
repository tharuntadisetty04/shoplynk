import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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

    if (username.length > 30 || username.length < 3) {
        throw new ApiError(400, "Username must be between 3 and 30 characters");
    }

    if (password.length > 30 || password.length < 8) {
        throw new ApiError(400, "Password must be between 8 and 30 characters");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    let avatarLocalPath;
    if (req.file) {
        avatarLocalPath = req.file.path;
    }

    let avatar;
    try {
        if (avatarLocalPath) {
            avatar = await uploadToCloudinary(avatarLocalPath);

            if (!avatar) {
                throw new ApiError(400, "Failed to upload avatar file to cloud");
            }
        } else {
            throw new ApiError(400, "Avatar file is missing or not uploaded");
        }
    } catch (error) {
        throw new ApiError(
            500,
            error.message || "Failed to upload avatar file to cloud"
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
        throw new ApiError(500, "User registration failed");
    }

    return res
        .status(201)
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

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                // { user: loggedInUser, accessToken, refreshToken },
                // { user: loggedInUser },
                loggedInUser,
                "User logged in successfully"
            )
        );
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, `User: ${req.user.username} logged out`)
        );
});

//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
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
        throw new ApiError(400, "Please Enter Email");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please Enter a valid Email");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, "User does not exist or Invalid email");
    }

    const resetToken = user.getPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n ${resetPasswordUrl} \n\n If you have not requested this email, then update your password or ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Password recovery request | ShopLynk`,
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

        throw new ApiError(500, error.message);
    }
});

//reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        throw new ApiError(400, "Please Enter Password");
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
        throw new ApiError(400, "Reset password token has expired or invalid ");
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Password do not match ");
    }

    if (password.length > 30 || password.length < 8) {
        throw new ApiError(
            400,
            "Password length must be between 8 and 30 characters"
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

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "Password has been reset and user logged in successfully"
            )
        );
});

//update current password
const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
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
        throw new ApiError(400, "All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please Enter a valid Email");
    }

    if (username.length > 30 || username.length < 3) {
        throw new ApiError(
            400,
            "Username length must be between 3 and 30 characters"
        );
    }

    const newUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username: username,
                email: email,
            },
        },
        { new: true }
    ).select("-password");

    if (!newUser) {
        throw new ApiError(500, "Account updation failed");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newUser,
                "Account details updated successfully"
            )
        );
});

//update from buyer to seller role
const updateUserRole = asyncHandler(async (req, res) => {
    const { username, email, role } = req.body;

    if ([username, email].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "Required fields are empty");
    }

    if (!username || !email || !role) {
        throw new ApiError(400, "Please enter the required fields");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please Enter a valid Email");
    }

    if (username.length > 30 || username.length < 3) {
        throw new ApiError(
            400,
            "Username length must be between 3 and 30 characters"
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                email,
                role: role.toLowerCase() || "seller",
            },
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(404, `User with ID ${req.user?._id} not found`);
    }

    res.status(200).json(
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

        await User.findByIdAndDelete(userId);

        res.status(200).json(
            new ApiResponse(200, {}, "User account deleted successfully")
        );
    } catch (error) {
        throw new ApiError(400, error?.message || "User cannot be deleted");
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
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, newRefreshToken } = await generateTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

//get all users --Admin
const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");

    if (!users) {
        throw new ApiError(404, "No users found");
    }

    res.status(200).json(
        new ApiResponse(200, users, "All users fetched successfully")
    );
});

//get single user --Admin
const getSingleUser = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(req.params?.id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );
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
    getAllUser,
    getSingleUser,
    updateUserRole,
    deleteUserProfile,
};
