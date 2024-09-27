import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import ProductSearch from "../utils/productSearch.js";
import mongoose from "mongoose";
import { uploadProductImagesToCloudinary } from "../utils/cloudinary.js";
import { deleteImagesFromCloudinary } from "../utils/cloudinary.js";

//create Product
const createProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, category, stock } = req.body;

    if (
        [name, description, category].some(
            (field) => !field || field?.trim() === ""
        )
    ) {
        return next(new ApiError(400, "Please enter the required fields"));
    }

    if (isNaN(price) || price.toString().length > 6) {
        return next(
            new ApiError(
                400,
                "Price must be a number and cannot exceed 6 digits"
            )
        );
    }

    if (isNaN(stock) || stock.toString().length > 4) {
        return next(
            new ApiError(
                400,
                "Stock must be a number and cannot exceed 4 digits"
            )
        );
    }

    const allowedCategories = [
        "fashion",
        "electronics",
        "personalcare",
        "home",
        "sports",
        "groceries",
    ];

    if (!allowedCategories.includes(category.toLowerCase())) {
        return next(new ApiError(400, "Invalid category provided"));
    }

    let uploadedImages = [];

    if (!req?.files || req.files.length === 0) {
        return next(new ApiError(400, "Product images are required"));
    }

    try {
        const imagePaths = req.files.map((file) => file.path);
        uploadedImages = await uploadProductImagesToCloudinary(imagePaths);
    } catch (error) {
        return next(
            new ApiError(
                500,
                error.message || "Failed to upload product images"
            )
        );
    }

    const newProduct = {
        name,
        description,
        price,
        images: uploadedImages.map((image) => ({
            public_id: image.public_id,
            url: image.secure_url,
        })),
        category: category.toLowerCase(),
        stock: stock || 1,
        owner: req?.user._id,
    };

    const product = await Product.create(newProduct);

    return res
        .status(201)
        .json(new ApiResponse(200, product, "Product added successfully"));
});

//get all products
const getAllProducts = asyncHandler(async (req, res, next) => {
    const resultPerPage = 12;
    const allProductsCount = await Product.countDocuments();

    const productFilters = new ProductSearch(Product.find(), req.query)
        .search()
        .filter();

    const filteredProductsCount = await Product.countDocuments(
        productFilters.data
    );

    const paginatedProducts = productFilters.pagination(resultPerPage).data;

    const products = await paginatedProducts;

    if (!products) {
        return next(new ApiError(500, "Products not found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { products, allProductsCount, filteredProductsCount },
                "Products fetched successfully"
            )
        );
});

//get similar products
const getSimilarProducts = asyncHandler(async (req, res, next) => {
    const productId = req.params?.id;
    const resultPerPage = 8;

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(new ApiError(400, "Invalid product ID"));
        }

        const product = await Product.findById(productId).lean();

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        const similarProductsQuery = new ProductSearch(
            Product.find({
                category: product.category,
                _id: { $ne: productId },
            }),
            req.query
        ).pagination(resultPerPage);

        const similarProducts = await similarProductsQuery.execute();

        if (!similarProducts) {
            return next(new ApiError(404, "No similar products found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    similarProducts,
                    "Similar products fetched successfully"
                )
            );
    } catch (error) {
        next(error);
    }
});

//get best selling products
const getBestSellingProducts = asyncHandler(async (req, res, next) => {
    const resultPerPage = 8;

    const products = new ProductSearch(
        Product.find({
            rating: { $gte: 4 },
        }),
        req.query
    ).pagination(resultPerPage);

    const bestProducts = await products.execute();

    if (!bestProducts) {
        return next(new ApiError(404, "Products not found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                bestProducts,
                "Best selling products fetched successfully"
            )
        );
});

//get product details
const getProductDetails = asyncHandler(async (req, res, next) => {
    const productId = req.params?.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(new ApiError(400, "Invalid product ID"));
        }

        const product = await Product.findById(productId).lean();

        if (!product) {
            return next(new ApiError(404, "Product not found"));
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
        next(error);
    }
});

//update product
const updateProduct = asyncHandler(async (req, res, next) => {
    const { id: productId } = req.params;
    const { name, description, price, stock } = req.body;

    if (
        ![name, description, price].every(Boolean) ||
        [name, description].some((field) => field.trim() === "")
    ) {
        return next(new ApiError(400, "Please provide all required fields"));
    }

    if (price.toString().length > 6) {
        return next(new ApiError(400, "Price cannot exceed 6 characters"));
    }

    if (stock.toString().length > 4) {
        return next(
            new ApiError(400, "Stock limit cannot exceed 4 characters")
        );
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        const oldImagePublicIds = product.images.map(
            (image) => image.public_id
        );

        await deleteImagesFromCloudinary(oldImagePublicIds);

        let uploadedImages = [];

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map((file) => file.path);
            uploadedImages = await uploadProductImagesToCloudinary(imagePaths);
        } else {
            return next(new ApiError(400, "Product images are required"));
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                price,
                stock,
                images: uploadedImages.map((image) => ({
                    public_id: image.public_id,
                    url: image.secure_url,
                })),
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return next(new ApiError(500, "Failed to update product"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedProduct,
                    "Product updated successfully"
                )
            );
    } catch (error) {
        if (error.name === "CastError") {
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
        const productToDelete = await Product.findById(productId);

        if (!productToDelete) {
            return next(new ApiError(404, "Product to be deleted not found"));
        }

        const publicIds = productToDelete.images.map(
            (image) => image.public_id
        );

        await deleteImagesFromCloudinary(publicIds);

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return next(new ApiError(404, "Failed to delete product"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Product deleted successfully"));
    } catch (error) {
        if (error.name === "CastError") {
            next(new ApiError(400, `Invalid product ID: ${productId}`));
        } else {
            next(error);
        }
    }
});

//get seller products only
const getSellerProducts = asyncHandler(async (req, res, next) => {
    const sellerId = req.user._id;

    const products = await Product.find({ owner: sellerId });

    const productsCount = products.length;

    if (!products) {
        return next(new ApiError(404, "No products found for this seller"));
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { products, productsCount },
            "Seller products fetched successfully"
        )
    );
});

//create or update product review
const createProductReview = asyncHandler(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    if (!rating || !comment) {
        return next(new ApiError(400, "Please provide a rating and comment"));
    }

    if (!productId) {
        return next(new ApiError(400, "Product ID is required"));
    }

    const review = {
        userId: req.user._id,
        name: req.user.username,
        rating: Number(rating),
        comment: comment.trim(),
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ApiError(404, "Product not found"));
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

    const totalRating = product.reviews.reduce(
        (sum, rev) => sum + rev.rating,
        0
    );

    product.rating = totalRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review added/updated successfully"));
});

//get all reviews of a product
const getAllReviews = asyncHandler(async (req, res, next) => {
    const productId = req.query.id;

    if (!productId) {
        return next(new ApiError(400, "Product ID is required"));
    }

    if (!mongoose.isValidObjectId(productId)) {
        return next(new ApiError(400, "Invalid Product ID"));
    }

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ApiError(404, "Product not found"));
    }

    const reviews = product.reviews;

    res.status(200).json(
        new ApiResponse(200, reviews, "All reviews fetched successfully")
    );
});

//delete product review
const deleteReview = asyncHandler(async (req, res, next) => {
    const { productId, reviewId } = req.query;

    if (!productId || !reviewId) {
        return next(new ApiError(400, "Product ID and Review ID are required"));
    }

    if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
        return next(new ApiError(400, "Invalid Product ID or Review ID"));
    }

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ApiError(404, "Product not found"));
    }

    const review = product.reviews.find((review) =>
        review._id.equals(reviewId)
    );

    if (!review) {
        return next(new ApiError(404, "Review to be deleted not found"));
    }

    if (!review.userId.equals(req.user._id)) {
        return next(
            new ApiError(403, "You are not authorized to delete this review")
        );
    }

    const newReviews = product.reviews.filter(
        (rev) => !rev._id.equals(reviewId)
    );

    const avg = newReviews.reduce((acc, rev) => acc + rev.rating, 0);
    const numOfReviews = newReviews.length;
    const newRating = numOfReviews > 0 ? avg / numOfReviews : 0;

    await Product.findByIdAndUpdate(
        productId,
        {
            reviews: newReviews,
            rating: newRating,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json(
        new ApiResponse(200, {}, "Review deleted successfully")
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
    getSellerProducts,
    getSimilarProducts,
    getBestSellingProducts,
};
