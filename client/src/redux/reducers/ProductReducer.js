import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    CLEAR_ERRORS,
} from "../constants/ProductConstant";

const initialState = {
    loading: false,
    products: [],
    error: null,
};

export const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALL_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ALL_PRODUCT_SUCCESS:
            return {
                loading: false,
                products: action.payload.data.products,
                productCount: action.payload.data.productCount,
            };
        case ALL_PRODUCT_FAIL:
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
