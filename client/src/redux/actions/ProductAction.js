import axios from "axios";
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    CLEAR_ERRORS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL
} from "../constants/ProductConstant";

const extractErrorMessage = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const preTag = doc.querySelector('pre');

    let errorMessage = 'Unknown error occurred.';
    if (preTag) {
        const message = preTag.innerHTML.split('<br>')[0];
        errorMessage = message.trim();
    }

    return errorMessage;
};

// Get all products
const getAllProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });

        const { data } = await axios.get("http://localhost:8000/api/v1/products");

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

        const { data } = await axios.get(`http://localhost:8000/api/v1/products/product/${id}`);

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

// Clear errors
const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

export { getAllProducts, getProductDetails, clearErrors }