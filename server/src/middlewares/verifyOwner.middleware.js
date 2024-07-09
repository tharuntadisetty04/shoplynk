import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyOwner = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        if (!product.owner.equals(userId)) {
            throw new ApiError(
                400,
                "Product can not be modified by the current seller"
            );
        }

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request");
    }
});
