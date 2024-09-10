import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/RootReducer";

const initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems"))
            : [],

        shippingInfo: localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
    },
};

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
});

export default store;
