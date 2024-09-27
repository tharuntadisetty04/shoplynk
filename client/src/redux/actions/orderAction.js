import axios from "axios";
import {
    CLEAR_ERRORS,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    MY_ORDERS_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    SELLER_ORDERS_FAIL,
    SELLER_ORDERS_REQUEST,
    SELLER_ORDERS_SUCCESS,
    UPDATE_ORDER_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
} from "../constants/orderConstant";

// Get the API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL;

// create new order
const createNewOrder = (order) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_ORDER_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.post(
            `${apiUrl}/api/v1/orders/new`,
            order,
            config
        );

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: errorMessage,
        });
    }
};

// get current user orders
const getCurrentUserOrders = () => async (dispatch) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST });

        const { data } = await axios.get(
            `${apiUrl}/api/v1/orders/my-orders`,
            {
                withCredentials: true,
            }
        );

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: MY_ORDERS_FAIL,
            payload: errorMessage,
        });
    }
};

// get seller orders
const getSellerOrders = () => async (dispatch) => {
    try {
        dispatch({ type: SELLER_ORDERS_REQUEST });

        const { data } = await axios.get(
            `${apiUrl}/api/v1/orders/admin/all`,
            {
                withCredentials: true,
            }
        );

        dispatch({
            type: SELLER_ORDERS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: SELLER_ORDERS_FAIL,
            payload: errorMessage,
        });
    }
};

// get order details
const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const { data } = await axios.get(
            `${apiUrl}/api/v1/orders/admin/order/${id}`,
            {
                withCredentials: true,
            }
        );

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: errorMessage,
        });
    }
};

// update order
const updateOrder = (orderData, orderId) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.patch(
            `${apiUrl}/api/v1/orders/admin/order/${orderId}`,
            orderData,
            config
        );

        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: errorMessage,
        });
    }
};

// delete order
const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ORDER_REQUEST });

        const { data } = await axios.delete(
            `${apiUrl}/api/v1/orders/admin/order/${id}`,
            { withCredentials: true }
        );

        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: errorMessage,
        });
    }
};

// Clear errors
const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

export {
    createNewOrder,
    clearErrors,
    getCurrentUserOrders,
    getSellerOrders,
    getOrderDetails,
    updateOrder,
    deleteOrder,
};
