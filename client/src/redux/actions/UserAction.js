import axios from "axios";
import {
    CLEAR_ERRORS,
    CLEAR_MESSAGE,
    DELETE_ACCOUNT_FAIL,
    DELETE_ACCOUNT_REQUEST,
    DELETE_ACCOUNT_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    LOAD_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_ROLE_FAIL,
    UPDATE_ROLE_REQUEST,
    UPDATE_ROLE_SUCCESS,
} from "../constants/UserConstant";

// Get the API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL;

// Login user
const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.post(
            `${apiUrl}/api/v1/user/login`,
            { email, password },
            config
        );

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

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
            `${apiUrl}/api/v1/user/register`,
            userData,
            config
        );

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: REGISTER_USER_FAIL,
            payload: errorMessage,
        });
    }
};

// get current user
const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await axios.get(`${apiUrl}/api/v1/user/current-user`, {
            withCredentials: true,
        });

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: LOAD_USER_FAIL,
            payload: errorMessage,
        });
    }
};

// Logout user
const logoutUser = () => async (dispatch) => {
    try {
        await axios.post(`${apiUrl}/api/v1/user/logout`, null, {
            withCredentials: true,
        });

        dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: LOGOUT_FAIL,
            payload: errorMessage,
        });
    }
};

// Update from buyer to seller role
const updateUserRole = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ROLE_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.patch(
            `${apiUrl}/api/v1/user/update-role`,
            userData,
            config
        );

        dispatch({
            type: UPDATE_ROLE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: UPDATE_ROLE_FAIL,
            payload: errorMessage,
        });
    }
};

// Update profile
const updateUserProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        };

        const { data } = await axios.patch(
            `${apiUrl}/api/v1/user/update-profile`,
            userData,
            config
        );

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: errorMessage,
        });
    }
};

// Update password
const updateUserPassword = (oldPassword, newPassword) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.patch(
            `${apiUrl}/api/v1/user/password/update`,
            { oldPassword, newPassword },
            config
        );

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: errorMessage,
        });
    }
};

// Forgot password
const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.post(
            `${apiUrl}/api/v1/user/password/forgot`,
            { email },
            config
        );

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: errorMessage,
        });
    }
};

// Reset password
const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await axios.put(
            `${apiUrl}/api/v1/user/password/reset/${token}`,
            passwords,
            config
        );

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: errorMessage,
        });
    }
};

// delete user account
const deleteUser = () => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ACCOUNT_REQUEST });

        const { data } = await axios.delete(
            `${apiUrl}/api/v1/user/delete-profile`,
            { withCredentials: true }
        );

        dispatch({
            type: DELETE_ACCOUNT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response.data.message || error.message;

        dispatch({
            type: DELETE_ACCOUNT_FAIL,
            payload: errorMessage,
        });
    }
};

// Clear errors
const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

// Clear message
const clearMessage = () => (dispatch) => {
    dispatch({ type: CLEAR_MESSAGE });
};

export {
    loginUser,
    clearErrors,
    registerUser,
    loadUser,
    logoutUser,
    updateUserRole,
    updateUserProfile,
    updateUserPassword,
    forgotPassword,
    deleteUser,
    resetPassword,
    clearMessage,
};
