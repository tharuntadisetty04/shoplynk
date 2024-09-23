import { combineReducers } from "@reduxjs/toolkit";
import {
    bestProductsReducer,
    createProductReducer,
    productModificationReducer,
    newReviewReducer,
    productDetailsReducer,
    productsReducer,
    similarProductsReducer,
    productReviewsReducer,
    deleteReviewReducer,
} from "./ProductReducer";
import { passwordsReducer, profileReducer, userReducer } from "./UserReducer";
import { cartReducer } from "./CartReducer";
import {
    currentUserOrdersReducer,
    newOrderReducer,
    orderDetailsReducer,
    orderModificationReducer,
    sellerOrdersReducer,
} from "./orderReducer";

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
    sellerOrders: sellerOrdersReducer,
    orderDetails: orderDetailsReducer,
    modifiedOrder: orderModificationReducer,
    allReviews: productReviewsReducer,
    deleteReview: deleteReviewReducer,
});

export default rootReducer;
