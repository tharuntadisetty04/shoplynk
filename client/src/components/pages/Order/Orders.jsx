import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserOrders } from "../../../redux/actions/orderAction";
import TitleHelmet from "../../utils/TitleHelmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrdersGrid from "../../utils/OrdersGrid";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../layout/Loaders/PageLoader";

const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, orders } = useSelector((state) => state.myOrders);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        dispatch(getCurrentUserOrders());
    }, [dispatch, error]);

    const handleShopNow = () => {
        navigate("/products");
    };

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

            {orders && orders?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full lg:min-h-[60svh] md:min-h-[65svh]">
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl mb-4">
                        No Orders Yet
                    </h1>

                    <p className="text-gray-600 mb-6">
                        It looks like you haven't placed any orders. Start shopping now!
                    </p>

                    <button
                        className="px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition"
                        onClick={handleShopNow}
                    >
                        Shop Now
                    </button>
                </div>
            ) : (
                orders && (
                    <>
                        <h2 className="text-2xl md:text-3xl font-bold text-center">
                            {user?.username || ""}'s{" "}
                            <span className="text-blue-600">Orders</span>
                        </h2>

                        <OrdersGrid orders={orders} />
                    </>
                )
            )}
        </div>
    );
};

export default Orders;
