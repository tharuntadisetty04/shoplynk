import React, { useState, useEffect, useRef } from "react";
import heroImg from "../../assets/hero-img.png";
import heroImg2 from "../../assets/hero-img2.png";
import { Link, useNavigate } from "react-router-dom";
import { GiAmpleDress } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";
import {
    MdOutlineFoodBank,
    MdElectricalServices,
    MdPayment,
} from "react-icons/md";
import { FaBowlFood, FaHandSparkles } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCustomerService2Line } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import ProductCard from "../utils/ProductCard";
import TitleHelmet from "../utils/TitleHelmet";
import ItemLoader from "../layout/ItemLoader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllProducts } from "../../redux/actions/ProductAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.products);
    const errorHandled = useRef(false);

    useEffect(() => {
        if (error && !errorHandled.current) {
            toast.error(error);
            dispatch(clearErrors());
            errorHandled.current = true;
        }

        dispatch(getAllProducts());
    }, [dispatch, error]);

    let bestSellingProducts = [];
    let featuredProducts = [];

    if (products) {
        bestSellingProducts = products
            .filter((product) => product.rating >= 4)
            .slice(0, 4);
        featuredProducts = products.slice(0, 8);
    }

    return (
        <div className="home w-full h-full">
            <TitleHelmet
                title={"Home | ShopLynk | Connecting You to the Best Deals"}
            />

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

            {/* hero section */}
            <div className="hero-banner w-full lg:h-svh h-full md:flex md:items-center md:justify-between px-8 md:px-16 md:mb-3 lg:-my-8">
                <div className="left-section flex-col flex gap-4">
                    <h1 className="lg:text-5xl md:text-3xl text-2xl font-bold flex-col flex lg:gap-1">
                        <span>Shop your favorite</span>
                        <span>products from one place.</span>
                    </h1>

                    <p className="font-medium md:flex-col md:flex md:my-2 text-justify">
                        <span>Browse our wide selection of high-quality products </span>
                        <span>
                            from verified sellers and find the perfect items for your needs.
                        </span>
                    </p>

                    <div className="flex gap-4">
                        <Link
                            to="/products"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                        >
                            Shop Now
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                        >
                            Become a Seller
                        </Link>
                    </div>
                </div>

                <div className="right-section mt-4 md:mt-0 w-fit">
                    <img src={heroImg} alt="Shopping image" width={700} loading="lazy" />
                </div>
            </div>

            {/* Browse by catergories section */}
            <div className="categories w-full h-fit py-4 px-8 md:px-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Browse by <span className="text-blue-600">Category</span>
                    </h2>

                    <Link
                        to="/products"
                        className="rounded-md bg-blue-600 md:px-3.5 px-2 md:py-2 py-1 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 text-center"
                    >
                        View All
                    </Link>
                </div>

                <div className="gap-6 grid place-items-center lg:grid-cols-6 md:grid-cols-3 grid-cols-2">
                    <div
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <GiAmpleDress />
                        </div>
                        <p className="font-medium md:text-lg">Fashion</p>
                    </div>

                    <div
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <MdElectricalServices />
                        </div>
                        <p className="font-medium md:text-lg">Electronics</p>
                    </div>

                    <div
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <FaHandSparkles />
                        </div>
                        <p className="font-medium md:text-lg">Personal Care</p>
                    </div>

                    <div
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-[3.7rem] text-4xl">
                            <MdOutlineFoodBank />
                        </div>
                        <p className="font-medium md:text-lg">Home & Kitchen</p>
                    </div>

                    <div
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <IoGameController />
                        </div>
                        <p className="font-medium md:text-lg">Sports & Games</p>
                    </div>

                    <div
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <FaBowlFood />
                        </div>
                        <p className="font-medium md:text-lg">Groceries</p>
                    </div>
                </div>
            </div>

            {/* Best selling products */}
            <div className="best-products w-full h-fit py-4 px-8 md:px-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Best <span className="text-blue-600">Selling Products</span>
                    </h2>

                    <Link
                        to="/products"
                        className="rounded-md bg-blue-600 md:px-3.5 px-2 md:py-2 py-1.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 text-center"
                    >
                        View All
                    </Link>
                </div>

                {loading ? (
                    <ItemLoader />
                ) : (
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 place-items-center gap-8">
                        {bestSellingProducts &&
                            bestSellingProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                    </div>
                )}
            </div>

            {/* Limited time offer */}
            <div className="limited-time-banner w-full h-fit md:flex md:items-center lg:justify-around md:justify-between px-8 lg:px-16 md:my-6 lg:gap-8 gap-4">
                <div className="img">
                    <img src={heroImg2} alt="Shopping image" width={540} loading="lazy" />
                </div>

                <div className="details">
                    <h1 className="font-bold flex flex-col">
                        <span className="lg:text-5xl text-3xl text-blue-600">
                            Limited Time Offer!
                        </span>
                        <span className="lg:text-3xl md:text-xl text-base">
                            Get Upto 30% Off On First Purchase
                        </span>
                    </h1>

                    <p className="font-medium md:text-lg text-sm lg:flex-col lg:flex md:my-2 mb-2">
                        <span>Discover More for Less - Enjoy discount on </span>
                        <span>All Items! Limited Time Offer, Act Fast!</span>
                    </p>

                    <Link
                        to="/products"
                        className="w-fit rounded-md bg-blue-600 md:px-3.5 md:py-2.5 p-2 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 flex items-center gap-2"
                    >
                        Shop Now <FaArrowRight />
                    </Link>
                </div>
            </div>

            {/* Featured products */}
            <div className="featured-products w-full h-fit py-4 px-8 md:px-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Featured <span className="text-blue-600">Products</span>
                    </h2>

                    <Link
                        to="/products"
                        className="rounded-md bg-blue-600 md:px-3.5 px-2 md:py-2 py-1.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        View All
                    </Link>
                </div>

                {loading ? (
                    <ItemLoader />
                ) : (
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 place-items-center gap-8">
                        {featuredProducts &&
                            featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                    </div>
                )}
            </div>

            {/* Why choose us section */}
            <div className="features w-full h-fit py-4 px-8 md:px-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    Why <span className="text-blue-600">Choose Us</span>
                </h2>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-3">
                    <div className="md:w-96 h-full w-72 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <TbTruckDelivery />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-medium text-xl">Free Shipping</h2>
                            <p className="text-gray-600 md:text-center">
                                Free Shipping for order above ₹3000
                            </p>
                        </div>
                    </div>

                    <div className="md:w-96 w-72 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <MdPayment />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-medium text-xl text-center">Flexible Payment</h2>
                            <p className="text-gray-600 md:text-center">
                                Multiple secure payment options
                            </p>
                        </div>
                    </div>

                    <div className="md:w-96 w-72 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <RiCustomerService2Line />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-medium text-xl">24*7 Support</h2>
                            <p className="text-gray-600 md:text-center">
                                We Support Online all days
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
