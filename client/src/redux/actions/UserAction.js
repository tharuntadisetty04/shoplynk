import axios from "axios";
import {
    CLEAR_ERRORS,
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
} from "../constants/UserConstant";
import { extractErrorMessage } from "../../components/utils/ExtractErrorMessage";

// Login user
const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.post(
            "http://localhost:8000/api/v1/user/login",
            { email, password },
            config
        );

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

        dispatch({
            type: LOGIN_FAIL,
            payload: errorMessage,
        });
    }
};

// Register user
const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        };

        const { data } = await axios.post(
            "http://localhost:8000/api/v1/user/register",
            userData,
            config
        );

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage =
            extractErrorMessage(error.response.data) || error.message;

        dispatch({
            type: REGISTER_USER_FAIL,
            payload: errorMessage,
        });
    }
};

// Clear errors
const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

export { loginUser, clearErrors, registerUser };
