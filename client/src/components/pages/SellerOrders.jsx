import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSellerOrders } from "../../redux/actions/orderAction";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../layout/PageLoader";
import SellerOrdersGrid from "../utils/SellerOrdersGrid";

const SellerOrders = ({ updateOrderHandler }) => {
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector((state) => state.sellerOrders);
    const { user } = useSelector((state) => state.user);

    const fetchOrders = () => {
        dispatch(getSellerOrders());
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        fetchOrders();
    }, [dispatch, error]);

    return loading ? (
        <PageLoader />
    ) : (
        <div className="seller-orders w-full h-full">
            <TitleHelmet title={`${user?.username}'s Orders | ShopLynk`} />

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

            {orders && orders?.length === 0 ? (
                <div className="flex flex-col items-center justify-center md:pb-0 pb-4 w-full h-full lg:min-h-[46svh] md:min-h-[65svh]">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold mb-4">No Orders Yet</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            You haven't received any orders yet. Once you do, they'll show up
                            here.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-500 text-neutral-100 py-2 px-4 rounded shadow-md transition duration-200">
                            Learn How to Get More Orders
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl md:text-3xl font-bold text-center">
                        {user?.username || ""}'s
                        <span className="text-blue-600"> Orders</span>
                    </h2>

                    <SellerOrdersGrid
                        orders={orders}
                        updateOrderHandler={updateOrderHandler}
                        fetchOrders={fetchOrders}
                    />
                </>
            )}
        </div>
    );
};

export default SellerOrders;
