import {
    CLEAR_ERRORS,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_RESET,
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
    UPDATE_ORDER_RESET,
    UPDATE_ORDER_SUCCESS,
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
                loading: false,
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

// get current user orders
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
                loading: false,
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

// get seller orders
const intialSellerOrdersState = {
    loading: false,
    orders: [],
    error: null,
};

const sellerOrdersReducer = (state = intialSellerOrdersState, action) => {
    switch (action.type) {
        case SELLER_ORDERS_REQUEST:
            return {
                loading: true,
            };
        case SELLER_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload.data,
            };
        case SELLER_ORDERS_FAIL:
            return {
                loading: false,
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

// get order details
const intialOrderDetailsState = {
    loading: false,
    order: {},
    error: null,
};

const orderDetailsReducer = (state = intialOrderDetailsState, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return {
                loading: true,
            };

        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: action.payload.data,
            };

        case ORDER_DETAILS_FAIL:
            return {
                loading: false,
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

// update or delete order reducer
const initialModifiedOrdersState = {
    loading: false,
    isUpdated: null,
    isDeleted: null,
    error: null,
};

const orderModificationReducer = (
    state = initialModifiedOrdersState,
    action
) => {
    switch (action.type) {
        case UPDATE_ORDER_REQUEST:
        case DELETE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload.success,
            };
        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload.success,
            };
        case UPDATE_ORDER_FAIL:
        case DELETE_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_ORDER_RESET:
            return {
                ...state,
                isUpdated: false,
            };
        case DELETE_ORDER_RESET:
            return {
                ...state,
                isDeleted: false,
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

export {
    newOrderReducer,
    currentUserOrdersReducer,
    sellerOrdersReducer,
    orderModificationReducer,
    orderDetailsReducer,
};
