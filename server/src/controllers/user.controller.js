import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

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

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Required fields are empty");
    }

    if (!username || !email || !password) {
        throw new ApiError(400, "Please enter the required fields");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please Enter a valid Email");
    }

    if (username.length > 30 || username.length < 3) {
        throw new ApiError(
            400,
            "Username may have exceeded the limit or below the limit"
        );
    }

    if (password.length > 30 || password.length < 8) {
        throw new ApiError(
            400,
            "Password may have exceeded the limit or below the limit"
        );
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const user = await User.create({
        username: username,
        email: email,
        password: password,
        avatar: {
            public_id: "sample avatar id",
            url: "sample avatar url",
        },
        role: role.toLowerCase() || "buyer",
    });

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

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Required fields are empty");
    }

    if (!email || !password) {
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
                { user: loggedInUser, accessToken, refreshToken },
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
    const user = await User.findOne({ email: req.body.email });

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

    if (req.body.password !== req.body.confirmPassword) {
        throw new ApiError(400, "Password does not match ");
    }

    if (req.body.password.length > 30 || req.body.password.length < 8) {
        throw new ApiError(
            400,
            "Password may have exceeded the limit or below the limit"
        );
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    user.password = req.body.password;
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
            "Password may have exceeded the limit or below the limit"
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

    if (!(username || email)) {
        throw new ApiError(400, "All fields are required");
    }

    if ([username, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Required fields are empty");
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

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfile
};
