import axios from "axios";
import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
} from "../constants/CartConstant";

// add to cart
const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const response = await axios.get(
        `${apiUrl}/api/v1/products/product/${id}`
    );
    const productData = response.data.data;

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: productData._id,
            name: productData.name,
            price: productData.price,
            image: productData.images[0].url,
            stock: productData.stock,
            quantity,
        },
    });

    const cartItems = getState().cart?.cartItems || [];

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// remove from cart
const removeCartItem = (id) => (dispatch, getState) => {
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id,
    });

    const cartItems = getState().cart?.cartItems || [];

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// save shipping info
const saveShippingInfo = (data) => (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
};

export { addItemsToCart, removeCartItem, saveShippingInfo };
