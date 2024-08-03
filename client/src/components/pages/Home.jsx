import React from "react";
import heroImg from "../../assets/hero-img.png";
import { Link } from "react-router-dom";
import { GiAmpleDress } from "react-icons/gi";
import { MdOutlineSportsEsports } from "react-icons/md";
import { MdOutlineFoodBank } from "react-icons/md";
import { BsHeartPulse } from "react-icons/bs";
import { FaBowlFood } from "react-icons/fa6";
import { MdElectricalServices } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdPayment } from "react-icons/md";
import Product from "../utils/Product";

const product = {
    name: "T-Shirt saradttre",
    price: 2024,
    image: [
        {
            url: "https://img.freepik.com/free-vector/simple-flat-i-heart-you-valentine-s-day-t-shirt_742173-14411.jpg?t=st=1722667718~exp=1722671318~hmac=9477941f0f54f00673b03704403d36a2f26f1c78e69f620cbedced8d4b485011&w=740",
        },
    ],
    _id: 1,
};

const Home = () => {
    return (
        <div className="home w-full h-full">
            {/* hero section */}
            <div className="hero-banner w-full h-fit md:flex md:items-center md:justify-between px-8 md:px-16 md:my-2 mt-0">
                <div className="left-section flex-col flex gap-4">
                    <h1 className="lg:text-5xl md:text-3xl text-2xl font-bold flex-col flex lg:gap-1">
                        <span>Shop your favorite</span>
                        <span>products from one place.</span>
                    </h1>

                    <p className="font-medium md:flex-col md:flex md:my-2">
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
                        className="rounded-md bg-blue-600 md:px-3.5 px-2 md:py-2 py-1 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        View All
                    </Link>
                </div>

                <div className="gap-6 grid place-items-center lg:grid-cols-6 md:grid-cols-3 grid-cols-2">
                    <Link
                        to="/products"
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <GiAmpleDress />
                        </div>
                        <p className="font-medium md:text-lg">Fashion</p>
                    </Link>

                    <Link
                        to="/products"
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <MdElectricalServices />
                        </div>
                        <p className="font-medium md:text-lg">Electronics</p>
                    </Link>

                    <Link
                        to="/products"
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <BsHeartPulse />
                        </div>
                        <p className="font-medium md:text-lg">Personal Care</p>
                    </Link>

                    <Link
                        to="/products"
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-6xl text-4xl">
                            <MdOutlineFoodBank />
                        </div>
                        <p className="font-medium md:text-lg">Home & Kitchen</p>
                    </Link>

                    <Link
                        to="/products"
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-6xl text-4xl">
                            <MdOutlineSportsEsports />
                        </div>
                        <p className="font-medium md:text-lg">Sports & Games</p>
                    </Link>

                    <Link
                        to="/products"
                        className="w-36 md:w-48 h-36 md:h-44 border-2 border-slate-200 hover:-translate-y-2 hover:bg-inherit bg-slate-200 duration-200 rounded-sm md:hover:scale-105 flex flex-col justify-center items-center hover:shadow-md hover:text-blue-600 gap-2"
                    >
                        <div className="font-medium md:text-5xl text-4xl">
                            <FaBowlFood />
                        </div>
                        <p className="font-medium md:text-lg">Groceries</p>
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
                        className="rounded-md bg-blue-600 md:px-3.5 px-2 md:py-2 py-1 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        View All
                    </Link>
                </div>

                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 place-items-center gap-8">
                    <Product product={product} />
                    <Product product={product} />
                    <Product product={product} />
                    <Product product={product} />

                    <Product product={product} />
                    <Product product={product} />
                    <Product product={product} />
                    <Product product={product} />
                </div>
            </div>

            {/* Why choose us section */}
            <div className="features w-full h-fit py-4 px-8 md:px-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    Why <span className="text-blue-600">Choose Us</span>
                </h2>

                <div className="flex flex-col md:flex-row justify-between items-center px-3 gap-4">
                    <div className="md:w-96 w-80 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <TbTruckDelivery />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-medium text-xl">Free Shipping</h2>
                            <p className="text-gray-600">
                                Free Shipping for order above ₹3000
                            </p>
                        </div>
                    </div>

                    <div className="md:w-96 w-80 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <MdPayment />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-medium text-xl">Flexible Payment</h2>
                            <p className="text-gray-600">Multiple secure payment options</p>
                        </div>
                    </div>

                    <div className="md:w-96 w-80 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <RiCustomerService2Line />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-medium text-xl">24*7 Support</h2>
                            <p className="text-gray-600">We Support Online all days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
