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
} from "../constants/ProductConstant";

const extractErrorMessage = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const preTag = doc.querySelector("pre");

    let errorMessage = "Unknown error occurred.";
    if (preTag) {
        const message = preTag.innerHTML.split("<br>")[0];
        errorMessage = message.trim();
    }

    return errorMessage;
};

// Get all products
const getAllProducts =
    (keyword = "", currentPage = 1, category, rating = 0, price = [1, 100000]) =>
        async (dispatch) => {
            try {
                dispatch({ type: ALL_PRODUCT_REQUEST });

                let apiLink = `http://localhost:8000/api/v1/products?keyword=${keyword}&page=${currentPage}&rating[gte]=${rating}&price[gte]=${price[0]}&price[lte]=${price[1]}`;

                if (category) {
                    apiLink = `http://localhost:8000/api/v1/products?keyword=${keyword}&page=${currentPage}&category=${category}&rating[gte]=${rating}&price[gte]=${price[0]}&price[lte]=${price[1]}`;
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
            `http://localhost:8000/api/v1/products/product/${id}`
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
const getBestSellingProducts = (id) => async (dispatch) => {
    try {
        dispatch({ type: BEST_PRODUCTS_REQUEST });

        const { data } = await axios.get(
            `http://localhost:8000/api/v1/products/best-products`
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
            `http://localhost:8000/api/v1/products/similar-products/${id}`
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
};
