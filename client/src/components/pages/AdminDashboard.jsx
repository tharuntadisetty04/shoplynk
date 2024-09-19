import React, { useState } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDashboard, MdLibraryAdd, MdRateReview } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { FaBagShopping, FaListUl } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import SellerProducts from "./SellerProducts";
import CreateProduct from "./CreateProduct";
import SellerOrders from "./SellerOrders";
import SellerProductReviews from "./SellerProductReviews";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isProductsOpen, setIsProductsOpen] = useState(false);

    const toggleProductsDropdown = () => {
        setIsProductsOpen(!isProductsOpen);
    };

    return (
        <div className="admin-dashboard h-full w-full px-8 md:px-16 min-h-[65svh]">
            <TitleHelmet title={"Admin Dashboard | ShopLynk"} />

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

            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="sidebar lg:w-1/5 w-full rounded shadow sticky top-1 bg-white p-4">
                    <h2 className="text-xl md:text-2xl font-bold text-start">
                        Admin <span className="text-blue-600">Dashboard</span>
                    </h2>

                    <div
                        className={`hover:text-blue-600 duration-200 flex items-center gap-1.5 cursor-pointer border-2 rounded p-2 hover:border-blue-600 mb-5 mt-3 ${activeTab === "dashboard"
                            ? "text-blue-600 border-2 border-blue-600"
                            : ""
                            } `}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        <span className="text-xl">
                            <MdDashboard />
                        </span>
                        <p className="text-base lg:text-lg font-semibold">Dashboard</p>
                    </div>

                    <div
                        className={`hover:text-blue-600 duration-200 flex items-center gap-1.5 cursor-pointer border-2 rounded p-2 hover:border-blue-600 justify-between ${isProductsOpen ? "rounded-b-none" : ""
                            }`}
                        onClick={toggleProductsDropdown}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">
                                <AiFillProduct />
                            </span>
                            <p className="text-base lg:text-lg font-semibold">Products</p>
                        </div>
                        <span className="text-xl pl-4">
                            {isProductsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </span>
                    </div>

                    {isProductsOpen && (
                        <div className="pl-6 py-2 space-y-1.5 border-2 rounded border-t-0 rounded-t-none">
                            <div
                                className={`hover:text-blue-600 duration-200 cursor-pointer flex items-center gap-2 ${activeTab === "your-products" ? "text-blue-600" : ""
                                    }`}
                                onClick={() => setActiveTab("your-products")}
                            >
                                <span className="text-base pr-0.5">
                                    <FaListUl />
                                </span>
                                <p className="text-base font-medium">Your Products</p>
                            </div>
                            <div
                                className={`hover:text-blue-600 duration-200 cursor-pointer flex items-center gap-2 ${activeTab === "create-product" ? "text-blue-600" : ""
                                    }`}
                                onClick={() => setActiveTab("create-product")}
                            >
                                <span className="text-lg">
                                    <MdLibraryAdd />
                                </span>
                                <p className="text-base font-medium">Create Product</p>
                            </div>
                        </div>
                    )}

                    <div
                        className={`hover:text-blue-600 duration-200 flex items-center gap-1.5 cursor-pointer border-2 rounded p-2 hover:border-blue-600 my-5 ${activeTab === "orders"
                            ? "text-blue-600 border-2 border-blue-600"
                            : ""
                            }`}
                        onClick={() => setActiveTab("orders")}
                    >
                        <span className="text-xl">
                            <FaBagShopping />
                        </span>
                        <p className="text-base lg:text-lg font-semibold">Orders</p>
                    </div>

                    <div
                        className={`hover:text-blue-600 duration-200 flex items-center gap-1.5 cursor-pointer border-2 rounded p-2 hover:border-blue-600 mt-5 mb-1 ${activeTab === "reviews"
                            ? "text-blue-600 border-2 border-blue-600"
                            : ""
                            }`}
                        onClick={() => setActiveTab("reviews")}
                    >
                        <span className="text-xl mt-1">
                            <MdRateReview />
                        </span>
                        <p className="text-base lg:text-lg font-semibold">Reviews</p>
                    </div>
                </div>

                <div className="content lg:w-4/5 w-full h-full border">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "your-products" && <SellerProducts />}
                    {activeTab === "create-product" && <CreateProduct />}
                    {activeTab === "orders" && <SellerOrders />}
                    {activeTab === "reviews" && <SellerProductReviews />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

const Dashboard = () => {
    return <div className="flex">dashboard content</div>;
};
