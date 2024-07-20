import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import ProductSearch from "../utils/productSearch.js";
import mongoose from "mongoose";

//create a product
const createProduct = asyncHandler(async (req, res) => {
    req.body.owner = req.user._id;
    const { name, description, price, image, category, stock } = req.body;

    if ([name, description, category].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Required fields are empty");
    }

    if (!name || !description || !price || !image || !category) {
        throw new ApiError(400, "Please enter the required fields");
    }

    if (typeof price !== "number" || price < 0) {
        throw new ApiError(400, "Price must be a non-negative number");
    }

    if (price.toString().length > 7) {
        throw new ApiError(400, "Price cannot exceed 7 characters");
    }

    if (stock.toString().length > 4) {
        throw new ApiError(400, "Stock limit cannot exceed 4 characters");
    }

    const product = await Product.create({
        name: name,
        description: description,
        price: price,
        image: image,
        category: category.toLowerCase(),
        stock: stock,
        owner: req.body.owner,
    });

    const isProductCreated = await Product.findById(product._id);

    if (!isProductCreated) {
        throw new ApiError(500, "Product creation failed in Database");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, isProductCreated, "Product added successfully")
        );
});

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
    const resultPerPage = 5; //12
    const productCount = await Product.countDocuments();

    const productFilters = new ProductSearch(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const products = await productFilters.data;

    if (!products || products.length === 0) {
        throw new ApiError(500, "Products not found in Database");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { products, productCount },
                "Products fetched successfully"
            )
        );
});

//get product details
const getProductDetails = asyncHandler(async (req, res, next) => {
    const productId = req.params?.id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    product,
                    "Product details fetched successfully"
                )
            );
    } catch (error) {
        if (error.name == "CastError") {
            next(new ApiError(400, `Invalid product ID: ${productId}`));
        } else {
            next(error);
        }
    }
});

//update product
const updateProduct = asyncHandler(async (req, res, next) => {
    const productId = req.params?.id;
    const { name, description, price, image, stock } = req.body;

    if ([name, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Required fields are empty");
    }

    if (!name || !description || !price || !image) {
        throw new ApiError(400, "Please enter the required fields");
    }

    if (typeof price !== "number" || price < 0) {
        throw new ApiError(400, "Price must be a non-negative number");
    }

    if (price.toString().length > 7) {
        throw new ApiError(400, "Price cannot exceed 7 characters");
    }

    if (stock.toString().length > 4) {
        throw new ApiError(400, "Stock limit cannot exceed 4 characters");
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    name: name,
                    description: description,
                    price: price,
                    image: image,
                    stock: stock,
                },
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        if (!updatedProduct) {
            throw new ApiError(404, "Product to be updated not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedProduct,
                    "Product details updated successfully"
                )
            );
    } catch (error) {
        if (error.name == "CastError") {
            next(new ApiError(400, `Invalid product ID: ${productId}`));
        } else {
            next(error);
        }
    }
});

//delete product
const deleteProduct = asyncHandler(async (req, res, next) => {
    const productId = req.params?.id;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            throw new ApiError(404, "Product to be deleted not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, [], "Product deleted successfully"));
    } catch (error) {
        if (error.name == "CastError") {
            next(new ApiError(400, `Invalid product ID: ${productId}`));
        } else {
            next(error);
        }
    }
});

//create or update product review
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment, productId } = req.body;

    if (!rating) {
        throw new ApiError(400, "Please enter ratings");
    }

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const review = {
        userId: req.user._id,
        name: req.user.username,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const existingReview = product.reviews.find((rev) =>
        rev.userId.equals(req.user._id)
    );

    if (existingReview) {
        existingReview.rating = rating;
        existingReview.comment = comment;
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.rating = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review added successfully"));
});

//get all reviews of a product
const getAllReviews = asyncHandler(async (req, res) => {
    const productId = req.query.id;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const reviews = product.reviews;

    res.status(200).json(
        new ApiResponse(200, reviews, "All reviews fetched successfully")
    );
});

//delete product review
const deleteReview = asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.query;

    if (!productId || !reviewId) {
        throw new ApiError(400, "Product ID and Review ID are required");
    }

    if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
        throw new ApiError(400, "Invalid Product ID or Review ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.reviewId.toString()
    );

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    const numOfReviews = reviews.length;
    const ratings = numOfReviews > 0 ? avg / numOfReviews : 0;

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json(
        new ApiResponse(200, updatedProduct, "Review deleted successfully")
    );
});

export {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getAllReviews,
    deleteReview,
};
