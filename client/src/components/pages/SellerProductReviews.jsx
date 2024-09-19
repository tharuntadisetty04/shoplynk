import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleHelmet from "../utils/TitleHelmet";
import { useDispatch, useSelector } from "react-redux";

const SellerProductReviews = () => {
    return (
        <div className="create-product w-full h-full py-4 px-8 md:px-16 border">
            <TitleHelmet title={"Product Reviews | ShopLynk"} />

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

            SellerProductReviews
        </div>
    );
};

export default SellerProductReviews;
