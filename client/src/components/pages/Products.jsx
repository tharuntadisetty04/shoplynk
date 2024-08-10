import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import TitleHelmet from "../utils/TitleHelmet";
import ProductCard from "../utils/ProductCard";
import ProductNotFound from "./ProductNotFound";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllProducts } from "../../redux/actions/ProductAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ItemLoader from "../layout/ItemLoader";

const Products = () => {
    const { keyword } = useParams();
    const dispatch = useDispatch();
    const { loading, error, products, productsCount } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        dispatch(getAllProducts(keyword));
    }, [dispatch, error, keyword]);

    if (products.length === 0) {
        return <ProductNotFound />;
    }

    return (
        <div className="products w-full h-full my-6">
            <TitleHelmet title={"Products | ShopLynk"} />

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

            <div className="options-section"></div>

            {loading ? (
                <ItemLoader />
            ) : (
                <div className="products-section grid place-items-center lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-y-8">
                    {products &&
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                </div>
            )}
        </div>
    );
};

export default Products;
