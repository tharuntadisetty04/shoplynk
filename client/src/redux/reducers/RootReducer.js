import { combineReducers } from "@reduxjs/toolkit";
import {
    bestProductsReducer,
    productDetailsReducer,
    productsReducer,
    similarProductsReducer,
} from "./ProductReducer";
import { passwordsReducer, profileReducer, userReducer } from "./UserReducer";
import { cartReducer } from "./CartReducer";

const rootReducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    similarProducts: similarProductsReducer,
    bestProducts: bestProductsReducer,
    user: userReducer,
    userProfile: profileReducer,
    forgotPassword: passwordsReducer,
    cart: cartReducer,
});

export default rootReducer;
