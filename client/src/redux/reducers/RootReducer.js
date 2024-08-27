import { combineReducers } from "@reduxjs/toolkit";
import {
    bestProductsReducer,
    productDetailsReducer,
    productsReducer,
    similarProductsReducer,
} from "./ProductReducer";
import { userReducer } from "./UserReducer";

const rootReducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    similarProducts: similarProductsReducer,
    bestProducts: bestProductsReducer,
    user: userReducer,
});

export default rootReducer;
