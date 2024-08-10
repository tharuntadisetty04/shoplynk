import { combineReducers } from "@reduxjs/toolkit";
import {
    productDetailsReducer,
    productsReducer,
    similarProductsReducer,
} from "./ProductReducer";

const rootReducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    similarProducts: similarProductsReducer,
});

export default rootReducer;
