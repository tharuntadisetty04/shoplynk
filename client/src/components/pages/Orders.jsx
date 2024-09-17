import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserOrders } from "../../redux/actions/orderAction";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../layout/PageLoader";
import OrdersGrid from "../utils/OrdersGrid";

const Orders = () => {
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector((state) => state.myOrders);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getCurrentUserOrders());

        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }
    }, [dispatch, error]);

    return loading ? (
        <PageLoader />
    ) : (
        <div className="my-orders w-full h-full lg:min-h-[60svh] md:min-h-[65svh] px-8 md:px-16">
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

            <h2 className="text-2xl md:text-3xl font-bold text-center">
                {user?.username || ""}'s <span className="text-blue-600">Orders</span>
            </h2>

            {orders && <OrdersGrid orders={orders} />}
        </div>
    );
};

export default Orders;
