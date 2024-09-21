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
    BEST_PRODUCTS_REQUEST,
    BEST_PRODUCTS_SUCCESS,
    BEST_PRODUCTS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_RESET,
    SELLER_PRODUCT_REQUEST,
    SELLER_PRODUCT_FAIL,
    SELLER_PRODUCT_SUCCESS,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAIL,
    CREATE_PRODUCT_RESET,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_RESET,
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
        case SELLER_PRODUCT_REQUEST:
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
        case SELLER_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload.data.products,
                productsCount: action.payload.data.productsCount,
            };
        case SELLER_PRODUCT_FAIL:
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

// best selling products reducer
const bestProductsState = {
    loading: false,
    bestProducts: [],
    error: null,
};

const bestProductsReducer = (state = bestProductsState, action) => {
    switch (action.type) {
        case BEST_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case BEST_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                bestProducts: action.payload.data,
                error: null,
            };
        case BEST_PRODUCTS_FAIL:
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

// create product reducer
const initialCreateProductState = {
    loading: false,
    product: {},
    error: null,
};

const createProductReducer = (state = initialCreateProductState, action) => {
    switch (action.type) {
        case CREATE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_PRODUCT_SUCCESS:
            return {
                loading: false,
                product: action.payload.data,
                success: action.payload.success,
            };
        case CREATE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case CREATE_PRODUCT_RESET:
            return {
                ...state,
                success: false,
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

// delete product reducer
const initialDeleteProductState = {
    loading: false,
    isDeleted: null,
    error: null,
};

const deleteProductReducer = (state = initialDeleteProductState, action) => {
    switch (action.type) {
        case DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload.success,
            };
        case DELETE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case DELETE_PRODUCT_RESET:
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

// create review reducer
const intialReviewState = {
    loading: false,
    review: {},
    error: null,
};

const newReviewReducer = (state = intialReviewState, action) => {
    switch (action.type) {
        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case NEW_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
            };
        case NEW_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case NEW_REVIEW_RESET:
            return {
                ...state,
                success: false,
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
    productsReducer,
    productDetailsReducer,
    similarProductsReducer,
    bestProductsReducer,
    newReviewReducer,
    createProductReducer,
    deleteProductReducer,
};
