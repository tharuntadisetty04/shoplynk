import { useEffect } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "../utils/ProgressBar";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toastMessage } = location.state || "";

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.user);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const tax = Math.floor(totalPrice * 0.18);
    const deliveryCharges = totalPrice < 5000 ? 0 : 200;
    const discountPercent = sessionStorage.getItem("discountPercent");
    const discount = Math.floor((totalPrice * discountPercent) / 100);
    const totalAmount = Math.floor(totalPrice + tax + deliveryCharges - discount);
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}, ${shippingInfo.country}`;

    useEffect(() => {
        const toastShown = localStorage.getItem("toastShown");

        if (toastMessage && !toastShown) {
            toast.success(toastMessage);
            localStorage.setItem("toastShown", "true");
        }

        return () => {
            localStorage.removeItem("toastShown");
        };
    }, [toastMessage]);

    const paymentHandler = () => {
        const data = {
            totalPrice,
            deliveryCharges,
            tax,
            totalAmount,
        };

        sessionStorage.setItem("orderInfo", JSON.stringify(data));

        if (isAuthenticated) {
            navigate("/order/payment");
        } else {
            navigate("/login?redirect=order/confirm");
        }
    };

    return (
        <div className="confirm-order-page w-full h-full lg:min-h-[60svh] md:min-h-[65svh] px-8 md:px-16">
            <TitleHelmet title={"Confirm Order | ShopLynk"} />

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

            <ProgressBar currentStep={2} />

            <h2 className="text-2xl md:text-3xl font-bold text-center pb-2">
                Confirm <span className="text-blue-600">Order</span>
            </h2>

            <div className="flex w-full flex-col lg:flex-row items-center lg:items-start justify-center gap-6 mb-8">
                <div className="flex flex-col lg:w-2/3 w-full gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold pb-2">
                            Billing Details
                        </h2>

                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold text-blue-600">
                                Name:{" "}
                                <span className="text-gray-900 font-medium">
                                    {user?.username}
                                </span>
                            </p>

                            <p className="text-lg font-semibold text-blue-600">
                                Phone:{" "}
                                <span className="text-gray-900 font-medium">
                                    {shippingInfo?.phoneNo}
                                </span>
                            </p>

                            <p className="text-lg font-semibold text-blue-600">
                                Address:{" "}
                                <span className="text-gray-900 font-medium">{address}</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold pb-2">
                            Cart Items
                        </h2>

                        <div className="flex flex-col">
                            {cartItems && window.innerWidth > 700
                                ? cartItems.map((item) => (
                                    <div
                                        key={item.product}
                                        className="flex items-center justify-between p-4 mb-4 last:mb-0 lg:w-[44rem] bg-white rounded"
                                    >
                                        <Link
                                            to={`/products/${item.product}`}
                                            className="flex items-center group w-72"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded duration-200 group-hover:shadow-md"
                                            />

                                            <div className="lg:ml-4 ml-2">
                                                <h3 className="text-lg font-medium lg:w-40 w-36 truncate">
                                                    {item.name}
                                                </h3>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            <p className="w-40 text-end font-medium">
                                                ₹{item.price.toFixed(2)} x {item.quantity} =
                                            </p>

                                            <p className="w-32 text-start font-medium text-blue-600">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                                : cartItems.map((item) => (
                                    <div
                                        key={item.product}
                                        className="flex items-center justify-between p-4 mb-4 last:mb-0 bg-white rounded"
                                    >
                                        <Link
                                            to={`/products/${item.product}`}
                                            className="flex items-center gap-4"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded duration-200 group-hover:shadow-md"
                                            />

                                            <div className="flex flex-col">
                                                <h3 className="text-lg font-medium w-40 truncate">
                                                    {item.name}
                                                </h3>

                                                <div className="flex items-center pt-1 justify-start">
                                                    <p className="text-base text-gray-700 mr-2">
                                                        ₹{item.price}x{item.quantity} =
                                                    </p>

                                                    <p className="text-base font-medium text-blue-600">
                                                        ₹{item.price * item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 shadow-md rounded-md h-full md:w-[24rem] w-full lg:sticky lg:top-1 mt-1">
                    <h2 className="text-lg font-semibold mb-4 text-center">
                        ORDER SUMMARY
                    </h2>

                    <div className="space-y-2">
                        <div className="flex justify-between font-medium">
                            <span>Price ({cartItems.length} items)</span>
                            <span>{totalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between font-medium">
                            <span>Delivery Charges</span>
                            <span className="text-blue-600">
                                + {deliveryCharges.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between font-medium">
                            <span>GST (18%)</span>
                            <span className="text-blue-600">+ {tax.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between font-medium">
                            <span>Discount ({discountPercent}%)</span>
                            <span className="text-blue-600">- {discount.toFixed(2)}</span>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mt-4 space-x-4">
                        <Link
                            to="/products"
                            className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded font-medium text-center"
                        >
                            Shop More
                        </Link>

                        <button
                            className="px-4 py-2 bg-blue-600 text-neutral-100 rounded font-medium shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                            onClick={paymentHandler}
                        >
                            Proceed to Pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrder;
