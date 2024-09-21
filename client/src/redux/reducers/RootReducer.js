import { combineReducers } from "@reduxjs/toolkit";
import {
    bestProductsReducer,
    createProductReducer,
    productModificationReducer,
    newReviewReducer,
    productDetailsReducer,
    productsReducer,
    similarProductsReducer,
} from "./ProductReducer";
import { passwordsReducer, profileReducer, userReducer } from "./UserReducer";
import { cartReducer } from "./CartReducer";
import { currentUserOrdersReducer, newOrderReducer } from "./orderReducer";

const rootReducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    similarProducts: similarProductsReducer,
    bestProducts: bestProductsReducer,
    user: userReducer,
    userProfile: profileReducer,
    forgotPassword: passwordsReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: currentUserOrdersReducer,
    newReview: newReviewReducer,
    newProduct: createProductReducer,
    modifiedProduct: productModificationReducer,
});

export default rootReducer;
