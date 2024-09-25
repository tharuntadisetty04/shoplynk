import axios from "axios";
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    CLEAR_ERRORS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    SIMILAR_PRODUCTS_REQUEST,
    SIMILAR_PRODUCTS_SUCCESS,
    SIMILAR_PRODUCTS_FAIL,
    BEST_PRODUCTS_REQUEST,
    BEST_PRODUCTS_SUCCESS,
    BEST_PRODUCTS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    SELLER_PRODUCT_REQUEST,
    SELLER_PRODUCT_SUCCESS,
    SELLER_PRODUCT_FAIL,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    ALL_REVIEW_REQUEST,
    ALL_REVIEW_SUCCESS,
    ALL_REVIEW_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
} from "../constants/ProductConstant";
import { extractErrorMessage } from "../ExtractErrorMessage";

// Get all products
const getAllProducts =
    (keyword = "", currentPage = 1, category, rating = 0, price = [1, 900000]) =>
        async (dispatch) => {
            try {
                dispatch({ type: ALL_PRODUCT_REQUEST });

                let apiLink = `https://shoplynk.onrender.com/api/v1/products?keyword=${keyword}&page=${currentPage}&rating[gte]=${rating}&price[gte]=${price[0]}&price[lte]=${price[1]}`;

                if (category) {
                    apiLink = `https://shoplynk.onrender.com/api/v1/products?keyword=${keyword}&page=${currentPage}&category=${category}&rating[gte]=${rating}&price[gte]=${price[0]}&price[lte]=${price[1]}`;
                }

                const { data } = await axios.get(apiLink);

                dispatch({
                    type: ALL_PRODUCT_SUCCESS,
                    payload: data,
                });
            } catch (error) {
                const errorMessage = extractErrorMessage(error.response.data);

                dispatch({
                    type: ALL_PRODUCT_FAIL,
                    payload: errorMessage,
                });
            }
        };

// Get product details
const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(
            `https://shoplynk.onrender.com/api/v1/products/product/${id}`
        );

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = extractErrorMessage(error.response.data);

        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: errorMessage,
        });
    }
};

// Get best selling products
const getBestSellingProducts = () => async (dispatch) => {
    try {
        dispatch({ type: BEST_PRODUCTS_REQUEST });

        const { data } = await axios.get(
            `https://shoplynk.onrender.com/api/v1/products/best-products`
        );

        dispatch({
            type: BEST_PRODUCTS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = extractErrorMessage(error.response.data);

        dispatch({
            type: BEST_PRODUCTS_FAIL,
            payload: errorMessage,
        });
    }
};

// Get similar products
const getSimilarProducts = (id) => async (dispatch) => {
    try {
        dispatch({ type: SIMILAR_PRODUCTS_REQUEST });

        const { data } = await axios.get(
            `https://shoplynk.onrender.com/api/v1/products/similar-products/${id}`
        );

        dispatch({
            type: SIMILAR_PRODUCTS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = extractErrorMessage(error.response.data);

        dispatch({
            type: SIMILAR_PRODUCTS_FAIL,
            payload: errorMessage,
        });
    }
};

// create new review
const createProductReview = (review) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.post(
            "https://shoplynk.onrender.com/api/v1/products/review",
            review,
            config
        );

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: errorMessage,
        });
    }
};

// Get all seller products
const getSellerProducts = () => async (dispatch) => {
    try {
        dispatch({ type: SELLER_PRODUCT_REQUEST });

        const { data } = await axios.get(
            "https://shoplynk.onrender.com/api/v1/products/admin/all",
            {
                withCredentials: true,
            }
        );

        dispatch({
            type: SELLER_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = extractErrorMessage(error.response.data);

        dispatch({
            type: SELLER_PRODUCT_FAIL,
            payload: errorMessage,
        });
    }
};

// create new product
const createNewProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_PRODUCT_REQUEST });

        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        };

        const { data } = await axios.post(
            "https://shoplynk.onrender.com/api/v1/products/admin/new",
            productData,
            config
        );

        dispatch({
            type: CREATE_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

        dispatch({
            type: CREATE_PRODUCT_FAIL,
            payload: errorMessage,
        });
    }
};

// update product
const updateProduct = (productData, productId) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        };

        const { data } = await axios.patch(
            `https://shoplynk.onrender.com/api/v1/products/admin/${productId}`,
            productData,
            config
        );

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: errorMessage,
        });
    }
};

// delete product
const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        const { data } = await axios.delete(
            `https://shoplynk.onrender.com/api/v1/products/admin/${id}`,
            { withCredentials: true }
        );

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: errorMessage,
        });
    }
};

// Get all product reviews
const getProductReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEW_REQUEST });

        const { data } = await axios.get(
            `https://shoplynk.onrender.com/api/v1/products/reviews?id=${id}`
        );

        dispatch({
            type: ALL_REVIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = extractErrorMessage(error.response.data);

        dispatch({
            type: ALL_REVIEW_FAIL,
            payload: errorMessage,
        });
    }
};

// delete product review
const deleteProductReview = (id, reviewId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });

        const { data } = await axios.delete(
            `https://shoplynk.onrender.com/api/v1/products/reviews?productId=${id}&reviewId=${reviewId}`,
            { withCredentials: true }
        );

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: errorMessage,
        });
    }
};

// Clear errors
const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

export {
    getAllProducts,
    getProductDetails,
    getSimilarProducts,
    getBestSellingProducts,
    clearErrors,
    createProductReview,
    getSellerProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
    getProductReviews,
    deleteProductReview,
};
