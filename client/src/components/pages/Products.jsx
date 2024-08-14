import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleHelmet from "../utils/TitleHelmet";
import ProductCard from "../utils/ProductCard";
import ProductNotFound from "./ProductNotFound";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllProducts } from "../../redux/actions/ProductAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import PageLoader from "../layout/PageLoader";
import ReactStars from "react-rating-stars-component";
import debounce from "lodash/debounce";

const Products = () => {
    const { keyword } = useParams();
    const dispatch = useDispatch();
    const { loading, error, products, productsCount, filteredProductsCount } =
        useSelector((state) => state.products);

    const resultPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([]);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isFashionOpen, setIsFashionOpen] = useState(false);
    const [isElectronicsOpen, setIsElectronicsOpen] = useState(false);
    const [isPersonalCareOpen, setIsPersonalCareOpen] = useState(false);
    const [isHomeKitchenOpen, setIsHomeKitchenOpen] = useState(false);
    const [isSportsOpen, setIsSportsOpen] = useState(false);
    const [isGroceriesOpen, setIsGroceriesOpen] = useState(false);
    const [isRatingsOpen, setIsRatingsOpen] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        dispatch(getAllProducts(keyword, currentPage));
    }, [dispatch, error, keyword, currentPage]);

    const handlePriceChange = debounce(() => {
        const defaultMinPrice = 1;
        const defaultMaxPrice = 100000;

        const minPrice = price[0] || defaultMinPrice;
        const maxPrice = price[1] || defaultMaxPrice;

        const finalMinPrice = Math.min(minPrice, maxPrice);
        const finalMaxPrice = Math.max(minPrice, maxPrice);

        const priceRange = [finalMinPrice, finalMaxPrice];
        setPrice(priceRange);

        dispatch(getAllProducts(keyword, currentPage, priceRange));
    }, 200);

    if (loading) {
        return <PageLoader />;
    }

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const togglePrice = () => {
        setIsPriceOpen(!isPriceOpen);
    };

    const handleMinPrice = (e) => {
        const value = Number(e.target.value);

        if (isNaN(value) || value < 1) {
            toast.warning("Enter a valid minimum price");
            setPrice([1, price[1]]);
        } else if (value > 100000) {
            toast.warning("Price limit exceeded");
            setPrice([1, price[1]]);
        } else {
            setPrice([Number(value), price[1]]);
        }
    };

    const handleMaxPrice = (e) => {
        const value = Number(e.target.value);

        if (isNaN(value) || value < 1) {
            toast.warning("Enter a valid maximum price");
            setPrice([price[0], 100000]);
        } else if (value > 100000) {
            toast.warning("Price limit exceeded");
            setPrice([price[0], 100000]);
        } else {
            setPrice([price[0], Number(value)]);
        }
    };

    const toggleCategory = () => {
        setIsCategoryOpen(!isCategoryOpen);
    };

    const toggleFashion = () => {
        setIsFashionOpen(!isFashionOpen);
    };

    const toggleElectronics = () => {
        setIsElectronicsOpen(!isElectronicsOpen);
    };

    const togglePersonalCare = () => {
        setIsPersonalCareOpen(!isPersonalCareOpen);
    };

    const toggleHomeKitchen = () => {
        setIsHomeKitchenOpen(!isHomeKitchenOpen);
    };

    const toggleSports = () => {
        setIsSportsOpen(!isSportsOpen);
    };

    const toggleGroceries = () => {
        setIsGroceriesOpen(!isGroceriesOpen);
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
                <aside className="options-section flex flex-col gap-2 h-full lg:sticky lg:top-2 w-full lg:w-1/4 rounded px-4 py-2 border-2 border-slate-200">
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
                            <div className="flex flex-col gap-3 pr-4 py-3">
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
                                    className="rounded-md bg-blue-600 p-2 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 text-sm"
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
                            <>
                                <div className="fashion py-1.5 pl-3">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={toggleFashion}
                                    >
                                        <h3 className="font-medium">Fashion</h3>
                                        <span className="font-medium md:text-lg text-base">
                                            {isFashionOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                        </span>
                                    </div>

                                    {isFashionOpen && (
                                        <ul className="pl-4 pt-1 space-y-1 font-medium list-disc">
                                            <li className="text-sm text-gray-700">All Fashion</li>
                                            <li className="text-sm text-gray-700">Men</li>
                                            <li className="text-sm text-gray-700">Women</li>
                                            <li className="text-sm text-gray-700">Kids</li>
                                            <li className="text-sm text-gray-700">Footwear</li>
                                            <li className="text-sm text-gray-700">Accessories</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="electronics py-1.5 pl-3">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={toggleElectronics}
                                    >
                                        <h3 className="font-medium">Electronics</h3>
                                        <span className="font-medium md:text-lg text-base">
                                            {isElectronicsOpen ? (
                                                <IoIosArrowUp />
                                            ) : (
                                                <IoIosArrowDown />
                                            )}
                                        </span>
                                    </div>

                                    {isElectronicsOpen && (
                                        <ul className="pl-4 pt-1 space-y-1 font-medium list-disc">
                                            <li className="text-sm text-gray-700">All Electronics</li>
                                            <li className="text-sm text-gray-700">Mobiles</li>
                                            <li className="text-sm text-gray-700">
                                                Laptop & Computers
                                            </li>
                                            <li className="text-sm text-gray-700">Home Appliances</li>
                                            <li className="text-sm text-gray-700">Cameras</li>
                                            <li className="text-sm text-gray-700">Audio & Video</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="personal-care py-1.5 pl-3">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={togglePersonalCare}
                                    >
                                        <h3 className="font-medium">Personal Care</h3>
                                        <span className="font-medium md:text-lg text-base">
                                            {isPersonalCareOpen ? (
                                                <IoIosArrowUp />
                                            ) : (
                                                <IoIosArrowDown />
                                            )}
                                        </span>
                                    </div>

                                    {isPersonalCareOpen && (
                                        <ul className="pl-4 pt-1 space-y-1 font-medium list-disc">
                                            <li className="text-sm text-gray-700">
                                                All Personal Care
                                            </li>
                                            <li className="text-sm text-gray-700">Skincare</li>
                                            <li className="text-sm text-gray-700">Haircare</li>
                                            <li className="text-sm text-gray-700">Bath & Body</li>
                                            <li className="text-sm text-gray-700">Oral Care</li>
                                            <li className="text-sm text-gray-700">Makeup</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="home-kitchen py-1.5 pl-3">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={toggleHomeKitchen}
                                    >
                                        <h3 className="font-medium">Home & Kitchen</h3>
                                        <span className="font-medium md:text-lg text-base">
                                            {isHomeKitchenOpen ? (
                                                <IoIosArrowUp />
                                            ) : (
                                                <IoIosArrowDown />
                                            )}
                                        </span>
                                    </div>

                                    {isHomeKitchenOpen && (
                                        <ul className="pl-4 pt-1 space-y-1 font-medium list-disc">
                                            <li className="text-sm text-gray-700">
                                                All Home & Kitchen
                                            </li>
                                            <li className="text-sm text-gray-700">Furniture</li>
                                            <li className="text-sm text-gray-700">Home Decor</li>
                                            <li className="text-sm text-gray-700">Kitchenware</li>
                                            <li className="text-sm text-gray-700">Bedding</li>
                                            <li className="text-sm text-gray-700">Lighting</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="sports py-1.5 pl-3">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={toggleSports}
                                    >
                                        <h3 className="font-medium">Sports</h3>
                                        <span className="font-medium md:text-lg text-base">
                                            {isSportsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                        </span>
                                    </div>

                                    {isSportsOpen && (
                                        <ul className="pl-4 pt-1 space-y-1 font-medium list-disc">
                                            <li className="text-sm text-gray-700">All Sports</li>
                                            <li className="text-sm text-gray-700">Fitness</li>
                                            <li className="text-sm text-gray-700">Outdoor</li>
                                            <li className="text-sm text-gray-700">Indoor</li>
                                            <li className="text-sm text-gray-700">Sportswear</li>
                                            <li className="text-sm text-gray-700">Accessories</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="groceries py-1.5 pl-3">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={toggleGroceries}
                                    >
                                        <h3 className="font-medium">Groceries</h3>
                                        <span className="font-medium md:text-lg text-base">
                                            {isGroceriesOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                        </span>
                                    </div>

                                    {isGroceriesOpen && (
                                        <ul className="pl-4 pt-1 space-y-1 font-medium list-disc">
                                            <li className="text-sm text-gray-700">All Groceries</li>
                                            <li className="text-sm text-gray-700">Beverages</li>
                                            <li className="text-sm text-gray-700">Snacks</li>
                                            <li className="text-sm text-gray-700">Packaged Food</li>
                                            <li className="text-sm text-gray-700">
                                                Baking Essentials
                                            </li>
                                            <li className="text-sm text-gray-700">Dairy & Eggs</li>
                                        </ul>
                                    )}
                                </div>
                            </>
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
                                    size={22}
                                    isHalf={true}
                                    activeColor="blue"
                                    onChange={(newRating) => console.log(newRating)}
                                />
                            </div>
                        )}
                    </div>
                </aside>

                <div className="product-section w-full">
                    {products.length === 0 ? (
                        <ProductNotFound />
                    ) : (
                        <div className="products-grid grid place-items-center lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-8">
                            {products &&
                                products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                        </div>
                    )}

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
        </div>
    );
};

export default Products;
