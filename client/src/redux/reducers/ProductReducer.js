import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    CLEAR_ERRORS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    SIMILAR_PRODUCTS_REQUEST,
    SIMILAR_PRODUCTS_SUCCESS,
    SIMILAR_PRODUCTS_FAIL,
} from "../constants/ProductConstant";

// all products reducer
const initialProductsState = {
    loading: false,
    products: [],
    productsCount: 0,
    error: null,
};

const productsReducer = (state = initialProductsState, action) => {
    switch (action.type) {
        case ALL_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ALL_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload.data.products,
                productsCount: action.payload.data.allProductsCount,
                filteredProductsCount: action.payload.data.filteredProductsCount,
                error: null,
            };
        case ALL_PRODUCT_FAIL:
            return {
                ...state,
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

// product details reducer
const initialProductDetailsState = {
    loading: false,
    product: {},
    error: null,
};

const productDetailsReducer = (state = initialProductDetailsState, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload.data,
                error: null,
            };
        case PRODUCT_DETAILS_FAIL:
            return {
                ...state,
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

// similar products reducer
const similarProductsState = {
    loading: false,
    similarProducts: [],
    error: null,
};

const similarProductsReducer = (state = similarProductsState, action) => {
    switch (action.type) {
        case SIMILAR_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SIMILAR_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                similarProducts: action.payload.data,
                error: null,
            };
        case SIMILAR_PRODUCTS_FAIL:
            return {
                ...state,
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

export { productsReducer, productDetailsReducer, similarProductsReducer };
