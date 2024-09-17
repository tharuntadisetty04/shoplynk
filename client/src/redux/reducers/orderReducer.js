import {
    CLEAR_ERRORS,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    MY_ORDERS_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
} from "../constants/orderConstant";

// create new order
const intialOrderState = {
    loading: false,
    order: {},
    error: null,
};

const newOrderReducer = (state = intialOrderState, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_ORDER_SUCCESS:
            return {
                loading: false,
                order: action.payload.data,
            };
        case CREATE_ORDER_FAIL:
            return {
                loading: true,
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

// create current user orders
const intialUserOrdersState = {
    loading: false,
    orders: [],
    error: null,
};

const currentUserOrdersReducer = (state = intialUserOrdersState, action) => {
    switch (action.type) {
        case MY_ORDERS_REQUEST:
            return {
                loading: true,
            };
        case MY_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload.data,
            };
        case MY_ORDERS_FAIL:
            return {
                loading: true,
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

export { newOrderReducer, currentUserOrdersReducer }