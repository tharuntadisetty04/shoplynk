import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifySeller = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return next(new ApiError(401, "Unauthorized request"));
        }

        if (user.role !== "seller") {
            return next(new ApiError(401, "Access denied"));
        }

        next();
    } catch (error) {
        return next(new ApiError(401, error?.message || "Unauthorized request"));
    }
});