import { combineReducers } from "@reduxjs/toolkit";
import { productsReducer } from "./ProductReducer";

const rootReducer = combineReducers({
    products: productsReducer,
});

export default rootReducer;
