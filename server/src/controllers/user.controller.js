import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import sendEmail from "../utils/sendEmail.js";

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
        .json(new ApiResponse(200, {}, "User logged out "));
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

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

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

export { registerUser, loginUser, logoutUser, getCurrentUser, forgotPassword };
