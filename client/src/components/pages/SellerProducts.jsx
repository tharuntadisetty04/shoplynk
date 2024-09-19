import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearErrors,
    getSellerProducts,
} from "../../redux/actions/ProductAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleHelmet from "../utils/TitleHelmet";

const SellerProducts = () => {
    const dispatch = useDispatch();
    const { loading, error, products, productsCount } = useSelector(
        (state) => state.products
    );
    const {
        user,
        loading: userLoading,
        error: userError,
    } = useSelector((state) => state.user);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (productsCount === 0) {
            toast.error("You don't have any products.", {
                onClose: () => dispatch(clearErrors()),
            });
        }

        dispatch(getSellerProducts());
    }, [dispatch, error]);

    return (
        <div className="seller-products w-full h-full py-4 px-8 md:px-16 border">
            <TitleHelmet title={`${user?.username}'s Products | ShopLynk`} />

            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition:Slide
            />

            <div className="flex justify-between items-center mb-4 -mt-4">
                <h2 className="text-2xl font-bold">
                    {user?.username} <span className="text-blue-600">Products</span>
                </h2>
            </div>

            <div className="product-section w-full">products</div>
        </div>
    );
};

export default SellerProducts;
