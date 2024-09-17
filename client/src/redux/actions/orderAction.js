import axios from "axios";
import {
    CLEAR_ERRORS,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    MY_ORDERS_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
} from "../constants/orderConstant";
import { extractErrorMessage } from "../ExtractErrorMessage";

// create new order
const createNewOrder = (order) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_ORDER_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.post(
            "http://localhost:8000/api/v1/orders/new",
            order,
            config
        );

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

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
            "http://localhost:8000/api/v1/orders/my-orders",
            {
                withCredentials: true,
            }
        );

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

        dispatch({
            type: MY_ORDERS_FAIL,
            payload: errorMessage,
        });
    }
};

// Clear errors
const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

export { createNewOrder, clearErrors, getCurrentUserOrders };
