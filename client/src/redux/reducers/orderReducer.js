import {
    CLEAR_ERRORS,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
} from "../constants/orderConstant";

// create new order
const intialOrderState = {
    loading: false,
    shippingInfo: {},
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

export { newOrderReducer }