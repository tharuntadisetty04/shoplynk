import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleHelmet from "../utils/TitleHelmet";
import ProductCard from "../utils/ProductCard";
import ProductNotFound from "./ProductNotFound";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllProducts } from "../../redux/actions/ProductAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ItemLoader from "../layout/ItemLoader";
import Pagination from "react-js-pagination";

const Products = () => {
    const { keyword } = useParams();
    const dispatch = useDispatch();
    const { loading, error, products, productsCount, filteredProductsCount } = useSelector(
        (state) => state.products
    );

    const resultPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const lastPageNumber = Math.ceil(productsCount / resultPerPage);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        dispatch(getAllProducts(keyword, currentPage));
    }, [dispatch, error, keyword, currentPage]);

    if (products.length === 0) {
        return <ProductNotFound />;
    }

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };

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
                <div className="flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-6 px-9">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            All <span className="text-blue-600">Products</span>
                        </h2>

                        <p className="text-lg md:text-xl font-medium">
                            Total Products:{" "}
                            <span className="text-blue-600">{filteredProductsCount}</span>
                        </p>
                    </div>

                    <div className="products-section grid place-items-center lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-y-8">
                        {products &&
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                    </div>

                    {resultPerPage < productsCount && (
                        <div className="pagination-box flex items-center justify-center mt-6 text-sm font-medium">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1"
                                lastPageText={lastPageNumber.toString()}
                                itemClass="page-item text-sm px-3.5 py-1.5 border-l-2 border-t-2 border-b-2 border-blue-600 text-blue-600 font-medium hover:cursor-pointer duration-200 hover:bg-blue-600 hover:text-neutral-100"
                                linkClass="flex items-center justify-center w-full h-full"
                                activeClass="bg-blue-600 text-neutral-100 border-2 border-r-0 border-blue-600"
                                activeLinkClass="font-semibold"
                                innerClass="flex"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;
