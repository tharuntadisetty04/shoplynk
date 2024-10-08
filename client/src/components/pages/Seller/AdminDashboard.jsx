import { useEffect, useState } from "react";
import TitleHelmet from "../../utils/TitleHelmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDashboard, MdLibraryAdd, MdRateReview } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { FaBagShopping, FaListUl } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import SellerProducts from "./SellerProducts";
import CreateProduct from "./CreateProduct";
import SellerOrders from "./SellerOrders";
import SellerProductReviews from "./SellerProductReviews";
import { Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getSellerProducts } from "../../../redux/actions/ProductAction";
import UpdateProduct from "./UpdateProduct";
import { getSellerOrders } from "../../../redux/actions/orderAction";
import ItemLoader from "../../layout/Loaders/ItemLoader";
import UpdateOrder from "./UpdateOrder";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const toggleProductsDropdown = () => {
        setIsProductsOpen(!isProductsOpen);
    };

    const updateProductHandler = (id) => {
        setSelectedProductId(id);
        setActiveTab("update-product");
    };

    const updateOrderHandler = (id) => {
        setSelectedOrderId(id);
        setActiveTab("update-order");
    };

    return (
        <div className="admin-dashboard h-full w-full px-8 md:px-16 lg:min-h-[60svh] md:min-h-[65svh]">
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
                <div className="sidebar lg:w-1/5 w-full rounded shadow lg:sticky lg:top-1 bg-white p-4">
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

                <div className="content lg:w-4/5 w-full h-full">
                    {activeTab === "dashboard" && (
                        <Dashboard setActiveTab={setActiveTab} />
                    )}

                    {activeTab === "your-products" && (
                        <SellerProducts
                            setActiveTab={setActiveTab}
                            updateProductHandler={updateProductHandler}
                        />
                    )}

                    {activeTab === "create-product" && <CreateProduct />}

                    {activeTab === "update-product" && (
                        <UpdateProduct productId={selectedProductId} />
                    )}

                    {activeTab === "orders" && (
                        <SellerOrders
                            setActiveTab={setActiveTab}
                            updateOrderHandler={updateOrderHandler}
                        />
                    )}

                    {activeTab === "update-order" && (
                        <UpdateOrder orderId={selectedOrderId} />
                    )}

                    {activeTab === "reviews" && <SellerProductReviews />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

const Dashboard = ({ setActiveTab }) => {
    const dispatch = useDispatch();

    const { loading, products, productsCount } = useSelector(
        (state) => state.products
    );
    const { loading: ordersLoading, orders } = useSelector(
        (state) => state.sellerOrders
    );

    useEffect(() => {
        dispatch(getSellerProducts());
        dispatch(getSellerOrders());
    }, [dispatch]);

    let outOfStock = 0;
    products?.forEach((product) => {
        if (product.stock === 0) {
            outOfStock += 1;
        }
    });

    const revenue = orders?.reduce((acc, order) => acc + order.totalPrice, 0);

    const pendingOrders = orders?.filter((order) =>
        order.orderItems.some(
            (item) =>
                item.orderStatus === "Processing" || item.orderStatus === "Shipping"
        )
    );

    const completedOrders = orders?.length - pendingOrders?.length;

    const revenueData = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT (INR) ",
                backgroundColor: ["#2563eb"],
                borderColor: ["#e2e8f0"],
                hoverBackgroundColor: ["#1d4ed8"],
                data: [0, revenue],
            },
        ],
    };

    const stockData = {
        labels: ["Out of Stock", "In Stock"],
        datasets: [
            {
                backgroundColor: ["#F05D5E", "#75DDDD"],
                hoverBackgroundColor: ["#EF4444", "#00A6B4"],
                data: [outOfStock, products?.length - outOfStock],
            },
        ],
    };

    const ordersData = {
        labels: ["Pending", "Completed"],
        datasets: [
            {
                backgroundColor: ["#F05D5E", "#75DDDD"],
                hoverBackgroundColor: ["#EF4444", "#00A6B4"],
                data: [completedOrders, pendingOrders?.length],
            },
        ],
    };

    return loading || ordersLoading ? (
        <ItemLoader />
    ) : productsCount !== 0 ? (
        <>
            <div className="dashboard">
                <h2 className="text-center text-xl md:text-2xl lg:font-bold font-semibold p-4 bg-blue-600 text-neutral-100 rounded lg:mx-4">
                    Tharun's store details
                </h2>

                <div className="flex items-center justify-center lg:gap-32 md:gap-8 gap-4 my-4">
                    <div
                        className="md:h-40 md:w-40 w-24 h-24 rounded-full bg-yellow-300 p-4 md:m-4 flex flex-col items-center justify-center shadow-md cursor-pointer"
                        onClick={() => setActiveTab("your-products")}
                    >
                        <span className="font-medium text-lg">Products</span>
                        <span className="font-medium text-lg">{productsCount}</span>
                    </div>

                    <div
                        className="md:h-40 md:w-40 w-24 h-24 rounded-full bg-teal-500 p-4 md:m-4 flex flex-col items-center justify-center shadow-md cursor-pointer"
                        onClick={() => setActiveTab("orders")}
                    >
                        <span className="font-medium text-lg text-neutral-100">Orders</span>
                        <span className="font-medium text-lg text-neutral-100">
                            {orders?.length}
                        </span>
                    </div>

                    <div className="md:h-40 md:w-40 w-24 h-24 rounded-full bg-rose-400 p-4 md:m-4 flex flex-col items-center justify-center shadow-md">
                        <span className="font-medium text-lg text-neutral-100">
                            Revenue
                        </span>
                        <span className="font-medium text-lg text-neutral-100">
                            {"₹" + revenue}
                        </span>
                    </div>
                </div>

                <div className="line-chart bg-white rounded-md shadow md:p-4 md:m-4 lg:mx-32 md:mx-8">
                    <Line data={revenueData} />
                </div>

                <div className="flex lg:mx-32 md:mx-10 flex-col md:flex-row items-center lg:justify-between justify-center lg:gap-10 md:gap-8 gap-4 my-6">
                    {productsCount > 0 && (
                        <div className="doughnut-chart bg-white md:p-6 p-2 rounded-md shadow lg:w-1/2 md:w-[49%]">
                            <h2 className="text-center font-semibold text-xl">Stock</h2>
                            <Doughnut data={stockData} />
                        </div>
                    )}

                    {orders && orders.length > 0 && (
                        <div className="doughnut-chart bg-white md:p-6 p-2 rounded-md shadow lg:w-1/2 md:w-[49%]">
                            <h2 className="text-center font-semibold text-xl">Orders</h2>
                            <Doughnut data={ordersData} />
                        </div>
                    )}
                </div>
            </div>
        </>
    ) : (
        <div className="flex flex-col items-center justify-center h-full lg:min-h-[50svh] md:min-h-[30svh] p-4 -mt-6 lg:mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl mb-4 text-center">
                No Products Available
            </h1>

            <p className="text-gray-600 mb-6 text-center">
                It looks like you haven't added any products yet. Start by adding your
                first product!
            </p>

            <button
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition"
                onClick={() => setActiveTab("create-product")}
            >
                Add Product
            </button>
        </div>
    );
};
