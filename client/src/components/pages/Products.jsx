import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import TitleHelmet from "../utils/TitleHelmet";
import ProductCard from "../utils/ProductCard";
import ProductNotFound from "./Product/ProductNotFound";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllProducts } from "../../redux/actions/ProductAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ReactStars from "react-rating-stars-component";
import debounce from "lodash/debounce";
import { GiAmpleDress } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";
import { MdOutlineFoodBank, MdElectricalServices } from "react-icons/md";
import { FaBowlFood, FaHandSparkles } from "react-icons/fa6";
import PageLoader from "../layout/Loaders/PageLoader";

const Products = () => {
    const { keyword } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();

    const { loading, error, products, productsCount, filteredProductsCount } =
        useSelector((state) => state.products);

    const resultPerPage = 12;
    const [category, setCategory] = useState(location.state?.category || "");
    const [activeCategory, setActiveCategory] = useState(
        location.state?.activeCategory || ""
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([]);
    const [rating, setRating] = useState(0);

    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isRatingsOpen, setIsRatingsOpen] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        dispatch(getAllProducts(keyword, currentPage, category, rating));
    }, [dispatch, error, keyword, currentPage, category, rating]);

    const handlePriceChange = () => {
        const defaultMinPrice = 1;
        const defaultMaxPrice = 900000;

        const minPrice = price[0] || defaultMinPrice;
        const maxPrice = price[1] || defaultMaxPrice;

        const finalMinPrice = Math.min(minPrice, maxPrice);
        const finalMaxPrice = Math.max(minPrice, maxPrice);

        const priceRange = [finalMinPrice, finalMaxPrice];
        setPrice(priceRange);

        dispatch(
            getAllProducts(keyword, 1, category, rating, priceRange)
        );
    };

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleMinPrice = (e) => {
        const value = e.target.value;

        if (value === "") {
            setPrice("");
            return;
        }

        const parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue) || parsedValue < 1) {
            toast.warning("Enter a valid minimum price");
            setPrice([1, price[1]]);
        } else if (parsedValue > 900000) {
            toast.warning("Price limit exceeded");
            setPrice([1, price[1]]);
        } else {
            setPrice([Number(parsedValue), price[1]]);
        }
    };

    const handleMaxPrice = (e) => {
        const value = e.target.value;

        if (value === "") {
            setPrice("");
            return;
        }

        const parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue) || parsedValue < 1) {
            toast.warning("Enter a valid maximum price");
            setPrice([price[0], 900000]);
        } else if (parsedValue > 900000) {
            toast.warning("Price limit exceeded");
            setPrice([price[0], 900000]);
        } else {
            setPrice([price[0], Number(value)]);
        }
    };

    const handleCategory = (category) => {
        setCategory(category);
        setActiveCategory(category);
    };

    const handleRatings = (rating) => {
        setRating(rating);
    };

    const clearFilters = debounce(() => {
        setPrice([1, 900000]);
        setCategory("");
        setActiveCategory("");
        setRating(0);
        setCurrentPage(1);
        dispatch(getAllProducts(keyword, 1, "", 0, [1, 900000]));
    }, 200);

    const togglePrice = () => {
        setIsPriceOpen(!isPriceOpen);
    };

    const toggleCategory = () => {
        setIsCategoryOpen(!isCategoryOpen);
    };

    const toggleRatings = () => {
        setIsRatingsOpen(!isRatingsOpen);
    };

    const startIndex = (currentPage - 1) * resultPerPage + 1;
    const endIndex = Math.min(currentPage * resultPerPage, filteredProductsCount);

    return (
        <div className="products w-full h-full py-4 px-8 md:px-16">
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

            {loading ? (
                <PageLoader />
            ) : products.length === 0 ? (
                <ProductNotFound clearFilters={clearFilters} />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4 -mt-4">
                        <h2 className="text-2xl font-bold">
                            All <span className="text-blue-600">Products</span>
                        </h2>

                        <p className="font-medium lg:pt-0 pt-1">
                            {window.innerWidth < 600 ? "" : "Showing"}{" "}
                            <span className="text-blue-600">
                                {startIndex} - {endIndex}
                            </span>{" "}
                            of <span className="text-blue-600">{filteredProductsCount}</span>
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start justify-between lg:gap-16 gap-8">
                        <aside className="options-section flex flex-col gap-2 h-full lg:sticky lg:top-2 w-full md:w-2/3 lg:w-1/4 rounded px-4 py-2 border-2 border-slate-200 mx-auto">
                            <h2 className="text-xl font-semibold border-b-2 border-slate-200 py-2">
                                Filters
                            </h2>

                            <div className="price">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={togglePrice}
                                >
                                    <h3 className="font-semibold text-lg">Price</h3>
                                    <span className="font-medium md:text-lg text-base">
                                        {isPriceOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </span>
                                </div>

                                {isPriceOpen && (
                                    <div className="flex flex-col gap-3 pr-4 pt-3 pb-1">
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                value={price[0]}
                                                className="w-1/2 text-sm outline-none px-1.5 py-1 rounded border-2 border-slate-200 focus:border-blue-600 duration-200"
                                                onChange={handleMinPrice}
                                                placeholder="Min"
                                            />
                                            <span className="px-2 text-md font-medium">to</span>
                                            <input
                                                type="text"
                                                value={price[1]}
                                                className="w-1/2 text-sm outline-none px-1.5 py-1 rounded border-2 border-slate-200 focus:border-blue-600 duration-200"
                                                onChange={handleMaxPrice}
                                                placeholder="Max"
                                            />
                                        </div>

                                        <button
                                            className="rounded bg-blue-600 p-2 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 text-sm"
                                            onClick={handlePriceChange}
                                        >
                                            Apply Price
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="categories">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={toggleCategory}
                                >
                                    <h3 className="font-semibold text-lg">Categories</h3>
                                    <span className="font-medium md:text-lg text-base">
                                        {isCategoryOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </span>
                                </div>

                                {isCategoryOpen && (
                                    <div className="categories flex flex-wrap justify-evenly gap-4 items-center pt-3 pb-1">
                                        <div
                                            className={`category rounded px-4 py-2 border-2 flex flex-col items-center gap-1 w-20 cursor-pointer ${activeCategory === "fashion"
                                                ? "border-blue-600"
                                                : "border-slate-200"
                                                }`}
                                            onClick={() => handleCategory("fashion")}
                                        >
                                            <GiAmpleDress className="text-2xl" />
                                            <span className="category-name text-xs">Fashion</span>
                                        </div>

                                        <div
                                            className={`category rounded px-4 py-2 border-2 flex flex-col items-center gap-1 w-20 cursor-pointer ${activeCategory === "electronics"
                                                ? "border-blue-600"
                                                : "border-slate-200"
                                                }`}
                                            onClick={() => handleCategory("electronics")}
                                        >
                                            <MdElectricalServices className="text-2xl" />
                                            <span className="category-name text-xs">Electronics</span>
                                        </div>

                                        <div
                                            className={`category rounded px-4 py-2 border-2 flex flex-col items-center gap-1 w-20 cursor-pointer ${activeCategory === "sports"
                                                ? "border-blue-600"
                                                : "border-slate-200"
                                                }`}
                                            onClick={() => handleCategory("sports")}
                                        >
                                            <IoGameController className="text-2xl" />
                                            <span className="category-name text-xs">Games</span>
                                        </div>

                                        <div
                                            className={`category rounded px-4 py-2 border-2 flex flex-col items-center gap-1 w-20 cursor-pointer ${activeCategory === "groceries"
                                                ? "border-blue-600"
                                                : "border-slate-200"
                                                }`}
                                            onClick={() => handleCategory("groceries")}
                                        >
                                            <FaBowlFood className="text-2xl" />
                                            <span className="category-name text-xs">Grocery</span>
                                        </div>

                                        <div
                                            className={`category rounded px-4 py-2 border-2 flex flex-col items-center gap-1 w-20 cursor-pointer ${activeCategory === "personalcare"
                                                ? "border-blue-600"
                                                : "border-slate-200"
                                                }`}
                                            onClick={() => handleCategory("personalcare")}
                                        >
                                            <FaHandSparkles className="text-2xl" />
                                            <span className="category-name text-xs text-center">
                                                Personal Care
                                            </span>
                                        </div>

                                        <div
                                            className={`category rounded px-4 py-2 border-2 flex flex-col items-center gap-1 w-20 cursor-pointer ${activeCategory === "home"
                                                ? "border-blue-600"
                                                : "border-slate-200"
                                                }`}
                                            onClick={() => handleCategory("home")}
                                        >
                                            <MdOutlineFoodBank className="text-2xl" />
                                            <span className="category-name text-xs text-center">
                                                Home & Kitchen
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="ratings">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={toggleRatings}
                                >
                                    <h3 className="font-semibold text-lg">Ratings</h3>
                                    <span className="font-medium md:text-lg text-base">
                                        {isRatingsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </span>
                                </div>

                                {isRatingsOpen && (
                                    <div>
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={rating}
                                            isHalf={true}
                                            activeColor="blue"
                                            onChange={(newRating) => handleRatings(newRating)}
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                className="rounded my-1 bg-blue-600 p-2 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 text-sm"
                                onClick={clearFilters}
                            >
                                Clear All Filters
                            </button>
                        </aside>

                        <div className="product-section w-full">
                            <div className="products-grid grid place-items-center lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-8">
                                {products &&
                                    products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                            </div>

                            <div className="pagination-box flex items-center justify-center lg:justify-end mt-6 text-sm font-medium">
                                {resultPerPage < filteredProductsCount && (
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={resultPerPage}
                                        totalItemsCount={productsCount}
                                        onChange={setCurrentPageNo}
                                        nextPageText="Next"
                                        prevPageText="Prev"
                                        itemClass="page-item text-sm px-3 py-1.5 text-blue-600 font-medium hover:cursor-pointer duration-200 hover:bg-blue-600 hover:text-neutral-100 rounded"
                                        linkClass="flex items-center justify-center w-full h-full"
                                        activeClass="bg-blue-600 text-neutral-100 rounded"
                                        activeLinkClass="font-semibold"
                                        innerClass="flex gap-1 items-center"
                                        disabledClass="hover:cursor-not-allowed opacity-50"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Products;
