import { Product } from "../models/product.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyOwner = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        if (!product.owner === userId) {
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
