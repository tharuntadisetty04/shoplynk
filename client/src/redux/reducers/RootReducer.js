import { combineReducers } from "@reduxjs/toolkit";
import { productDetailsReducer, productsReducer } from "./ProductReducer";

const rootReducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer
});

export default rootReducer;
