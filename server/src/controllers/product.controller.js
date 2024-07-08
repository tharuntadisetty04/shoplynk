import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import ProductSearch from "../utils/productSearch.js";

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

    // const product = await Product.create(req.body);

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
    const resultPerPage = 12;
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

export {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductDetails,
};
