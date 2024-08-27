import {
    CLEAR_ERRORS,
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
} from "../constants/UserConstant";

const initialUserState = {
    loading: false,
    user: {},
    isAuthenticated: false,
    error: null,
};

const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_USER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false,
            };
        case LOGIN_SUCCESS:
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.data,
                isAuthenticated: true,
            };
        case LOGIN_FAIL:
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                user: null,
                isAuthenticated: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export { userReducer };
