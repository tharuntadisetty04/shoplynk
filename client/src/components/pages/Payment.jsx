import React, { useEffect, useRef, useState, useCallback } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "../utils/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import paymentImg from "../../assets/payment.jpg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
    Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { clearErrors, createNewOrder } from "../../redux/actions/orderAction";
import PageLoader from "../layout/PageLoader";

const paymentSchema = z.object({
    cardHolderName: z.string().min(1, "Please enter card holder name"),
});

const Payment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const paymentBtn = useRef(null);

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "{}");
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { error, loading } = useSelector((state) => state.newOrder);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(paymentSchema),
    });

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (!isAuthenticated) {
            navigate("/login?redirect=order/payment");
        }
    }, [isAuthenticated, navigate, error, dispatch]);

    const paymentData = {
        amount: Math.round(orderInfo.totalAmount * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.totalPrice,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.deliveryCharges,
        totalPrice: orderInfo.totalAmount,
    };

    const onSubmit = useCallback(
        async (formData) => {
            try {
                if (!paymentBtn.current) return;
                paymentBtn.current.disabled = true;

                const config = {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                };

                const { data } = await axios.post(
                    "http://localhost:8000/api/v1/payment/process-payment",
                    paymentData,
                    config
                );

                const client_secret = data.data.client_secret;

                if (!stripe || !elements) return;

                const paymentResult = await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: formData.cardHolderName,
                            email: user?.email,
                            address: {
                                line1: shippingInfo.address,
                                city: shippingInfo.city,
                                state: shippingInfo.state,
                                postal_code: shippingInfo.pinCode,
                                country: shippingInfo.country,
                            },
                        },
                    },
                });

                if (paymentResult.error) {
                    paymentBtn.current.disabled = false;
                    toast.error(paymentResult.error.message);
                } else {
                    if (paymentResult.paymentIntent.status === "succeeded") {
                        toast.success("Payment successful!");

                        order.paymentInfo = {
                            id: paymentResult.paymentIntent.id,
                            status: paymentResult.paymentIntent.status,
                        };

                        dispatch(createNewOrder(order));
                        navigate("/order/success");
                    } else {
                        toast.error("There's some issue while processing payment.");
                    }
                }
            } catch (error) {
                toast.error("Payment failed");
                if (paymentBtn.current) {
                    paymentBtn.current.disabled = false;
                }
            }
        },
        [stripe, elements, paymentData, user, shippingInfo, navigate]
    );

    return loading ? (
        <PageLoader />
    ) : (
        <div className="payment-page w-full h-full lg:min-h-[60svh] md:min-h-[65svh] px-8 md:px-16">
            <TitleHelmet title={"Payment | ShopLynk"} />

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

            <ProgressBar currentStep={3} />

            <h2 className="text-2xl md:text-3xl font-bold text-center pb-2">
                Payment <span className="text-blue-600">Info</span>
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-32 lg:-ml-6 md:gap-4 w-full mt-1 mb-3">
                <img
                    src={paymentImg}
                    alt="Payment Image"
                    width={500}
                    className="mix-blend-multiply md:block hidden"
                />

                <form
                    className="bg-slate-200 rounded shadow-sm px-6 py-4 my-4 space-y-2 lg:w-1/4 md:w-[28rem] w-full -mt-1"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex gap-1 flex-col">
                        <label htmlFor="cardHolderName" className="font-medium text-lg">
                            Card Holder Name
                        </label>

                        <input
                            type="text"
                            id="cardHolderName"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            placeholder="Enter card holder name"
                            {...register("cardHolderName")}
                        />

                        {errors.cardHolderName && (
                            <span className="text-red-500 text-sm font-medium pl-1">
                                {errors.cardHolderName.message}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-1 flex-col">
                        <label htmlFor="cardNumber" className="font-medium text-lg">
                            Card Number
                        </label>

                        <CardNumberElement className="bg-white p-3 rounded-sm text-xl font-medium" />
                    </div>

                    <div className="flex justify-between gap-4 pb-2">
                        <div className="flex gap-1 flex-col w-1/2">
                            <label htmlFor="expiryDate" className="font-medium text-lg">
                                Expiry Date
                            </label>

                            <CardExpiryElement className="bg-white p-3 rounded-sm text-xl font-medium" />
                        </div>

                        <div className="flex gap-1 flex-col w-1/2">
                            <label htmlFor="cvv" className="font-medium text-lg">
                                CVV
                            </label>

                            <CardCvcElement className="bg-white p-3 rounded-sm text-xl font-medium" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 font-medium text-neutral-100 py-2 px-4 rounded duration-200 w-full"
                        ref={paymentBtn}
                    >
                        Pay ₹{orderInfo?.totalAmount || "0"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const PaymentWrapper = () => {
    const [stripeApiKey, setStripeApiKey] = useState("");

    const getStripeApiKey = useCallback(async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:8000/api/v1/payment/payment-apikey",
                {
                    withCredentials: true,
                }
            );
            setStripeApiKey(data.stripeApiKey);
        } catch (error) {
            toast.error("Failed to load Stripe API key");
        }
    }, []);

    useEffect(() => {
        getStripeApiKey();
    }, [getStripeApiKey]);

    return (
        stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
            </Elements>
        )
    );
};

export default PaymentWrapper;
