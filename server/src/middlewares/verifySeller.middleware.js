import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifySeller = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        const seller = await User.findById(user?._id).select("+role");

        if (!(user.role === "seller")) {
            throw new ApiError(401, "Buyer role is not allowed to access");
        }

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request");
    }
});
