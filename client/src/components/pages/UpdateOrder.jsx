import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    clearErrors,
    getOrderDetails,
    updateOrder,
} from "../../redux/actions/orderAction";
import ItemLoader from "../layout/ItemLoader";
import { z } from "zod";
import TitleHelmet from "../utils/TitleHelmet";
import { UPDATE_ORDER_RESET } from "../../redux/constants/orderConstant";

const updateOrderSchema = z.object({
    status: z.enum(["Shipped", "Delivered"], {
        required_error: "Status is required",
    }),
});

const UpdateOrder = ({ orderId }) => {
    const dispatch = useDispatch();
    const { loading, error, order } = useSelector((state) => state.orderDetails);
    const {
        loading: updateLoading,
        error: updateError,
        isUpdated,
    } = useSelector((state) => state.modifiedOrder);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateOrderSchema),
    });

    useEffect(() => {
        dispatch(getOrderDetails(orderId));

        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (updateError) {
            toast.error(orderError, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (isUpdated) {
            toast.success("Order updated successfully!");
            dispatch({ type: UPDATE_ORDER_RESET });
        }
    }, [dispatch, orderId, error, updateError, isUpdated]);

    const address = `${order?.shippingInfo?.address}, ${order?.shippingInfo?.city}, ${order?.shippingInfo?.state}, ${order?.shippingInfo?.pincode}, ${order?.shippingInfo?.country}`;

    const getOrderStatus = useMemo(
        () => (orderItems) =>
            !orderItems
                ? "Processing"
                : orderItems.every((item) => item.orderStatus === "Delivered")
                    ? "Delivered"
                    : orderItems.some((item) => item.orderStatus === "Shipped")
                        ? "Shipped"
                        : "Processing",
        []
    );

    const onSubmit = (data) => {
        dispatch(updateOrder(data, orderId));
    };

    return loading ? (
        <ItemLoader />
    ) : (
        <div className="flex lg:gap-4 flex-col lg:flex-row">
            <TitleHelmet title={"Update Order | ShopLynk"} />
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
            />
            <div className="lg:w-1/2 w-full flex gap-3 flex-col">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
                        Shipping Info
                    </h2>

                    <p className="text-lg font-semibold">
                        Name:{" "}
                        <span className="text-gray-900 font-medium">
                            {order?.user?.username}
                        </span>
                    </p>
                    <p className="text-lg font-semibold">
                        Phone:{" "}
                        <span className="text-gray-900 font-medium">
                            {order?.shippingInfo?.phoneNo}
                        </span>
                    </p>
                    <p className="text-lg font-semibold">
                        Email:{" "}
                        <span className="text-gray-900 font-medium">
                            {order?.user?.email}
                        </span>
                    </p>
                    <p className="text-lg font-semibold">
                        Address:{" "}
                        <span className="text-gray-900 font-medium">{address}</span>
                    </p>
                </div>

                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
                        Payment Details
                    </h2>

                    <div className="flex flex-col gap-1">
                        <p className="text-lg font-semibold">
                            Status:{" "}
                            <span className="text-gray-900 font-medium">
                                {order?.paymentInfo?.status == "succeeded" ? (
                                    <span className="text-green-600">Success</span>
                                ) : (
                                    <span className="text-red-600">Failed</span>
                                )}
                            </span>
                        </p>
                        <p className="text-lg font-semibold">
                            Paid At:{" "}
                            <span className="text-gray-900 font-medium">
                                {order?.paidAt ? order.paidAt.slice(0, 10) : "N/A"}
                            </span>
                        </p>
                        <p className="text-lg font-semibold">
                            Amount:{" "}
                            <span className="text-gray-900 font-medium">
                                ₹{order?.totalPrice} (including all taxes)
                            </span>
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
                        Order Status
                    </h2>
                    <p className="text-lg font-semibold pb-1">
                        Status:{" "}
                        <span
                            className={`${getOrderStatus(order?.orderItems) === "Delivered"
                                ? "text-green-600"
                                : getOrderStatus(order?.orderItems) === "Shipped"
                                    ? "text-orange-600"
                                    : "text-red-600"
                                }`}
                        >
                            {getOrderStatus(order?.orderItems)}
                        </span>
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className={`flex gap-2 ${getOrderStatus(order?.orderItems) === "Delivered"
                            ? "hidden"
                            : "block"
                            }`}
                    >
                        <select
                            {...register("status")}
                            className="p-2 font-medium rounded outline-blue-600 border-none w-1/2"
                        >
                            <option value="" disabled>
                                -- Choose status --
                            </option>
                            {getOrderStatus(order?.orderItems) === "Processing" && (
                                <option value="Shipped">Shipped</option>
                            )}
                            {getOrderStatus(order?.orderItems) === "Shipped" && (
                                <option value="Delivered">Delivered</option>
                            )}
                        </select>

                        {errors.status && (
                            <p className="text-red-600">{errors.status.message}</p>
                        )}

                        <button
                            type="submit"
                            className="rounded cursor-pointer bg-blue-600 px-4 py-2 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500"
                            disabled={updateLoading}
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:w-1/2 w-full lg:pb-0 pb-4">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-600 pb-2">
                    Order Items
                </h2>

                {order?.orderItems &&
                    order?.orderItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center lg:justify-between gap-4 p-4 mb-4 last:mb-0 w-full bg-white rounded hover:shadow duration-200"
                        >
                            {window.innerWidth > 700 ? (
                                <>
                                    <div className="flex items-center justify-between gap-4 py-2 group">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded duration-200 group-hover:shadow-md"
                                            />
                                            <div className="lg:ml-4 ml-2">
                                                <h3 className="text-lg font-medium truncate max-w-xs">
                                                    {item.name.length > 15
                                                        ? item.name.slice(0, 15) + "..."
                                                        : item.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className="text-right font-medium">
                                                ₹{item.price} x {item.quantity} =
                                            </p>

                                            <p className="text-left font-medium text-blue-600">
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded duration-200 group-hover:shadow-md"
                                    />

                                    <div className="flex flex-col items-center justify-center">
                                        <h3 className="text-lg font-medium lg:w-40 truncate">
                                            {item.name}
                                        </h3>

                                        <div className="flex-col pl-3">
                                            <p className="w-40 text-start font-medium">
                                                ₹{item.price.toFixed(2)} x {item.quantity} =
                                            </p>
                                            <p className="w-32 text-start font-medium text-blue-600">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default UpdateOrder;
