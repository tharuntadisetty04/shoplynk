import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const OrdersGrid = ({ orders }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Sorting logic
    const sortedData = useMemo(() => {
        if (sortConfig.key) {
            return [...orders].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return orders;
    }, [orders, sortConfig]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                    <thead className="bg-slate-200">
                        <tr>
                            <th
                                className="pl-4 sm:pl-24 text-left cursor-pointer"
                                onClick={() => requestSort("_id")}
                            >
                                Order ID
                                {sortConfig.key === "_id"
                                    ? sortConfig.direction === "asc"
                                        ? " ▲"
                                        : " ▼"
                                    : null}
                            </th>
                            <th className="p-2 text-left pl-4 sm:pl-28">Items</th>
                            <th
                                className="p-2 text-left cursor-pointer"
                                onClick={() => requestSort("totalPrice")}
                            >
                                Total Price
                                {sortConfig.key === "totalPrice"
                                    ? sortConfig.direction === "asc"
                                        ? " ▲"
                                        : " ▼"
                                    : null}
                            </th>
                            <th className="p-2 text-left">Order Status</th>
                            <th className="p-2 text-left pl-4 sm:pl-28">Shipping Address</th>
                            <th className="p-2 text-left">Payment Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="p-2 border-b">
                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="w-fulls hover:text-blue-600"
                                    >
                                        {order._id}
                                    </Link>
                                </td>
                                <td className="p-2 border-b">
                                    {order.orderItems.slice(0, 3).map((item, idx) => (
                                        <ul key={idx} className="list-disc">
                                            <li className="flex gap-1">
                                                <span className="w-32 truncate">
                                                    {item.name.length > 15
                                                        ? item.name.slice(0, 15) + "..."
                                                        : item.name}
                                                </span>
                                                {" - "}
                                                {item.quantity} pcs @ ₹{item.price}
                                            </li>
                                        </ul>
                                    ))}
                                    {order.orderItems.length > 3 && (
                                        <span className="font-semibosld">
                                            ... and {order.orderItems.length - 3} others
                                        </span>
                                    )}
                                </td>
                                <td className="p-2 pl-4 border-b text-left">
                                    ₹{order.totalPrice}
                                </td>
                                <td className="p-2 border-b pl-3">
                                    {order.orderItems[0].orderStatus}
                                </td>
                                <td className="p-2 border-b">
                                    <span>
                                        {order.shippingInfo.address.length > 15
                                            ? order.shippingInfo.address.slice(0, 15) + "..."
                                            : order.shippingInfo.address}
                                    </span>
                                    , {order.shippingInfo.city}, {order.shippingInfo.state},{" "}
                                    {order.shippingInfo.country} - {order.shippingInfo.pincode}
                                </td>
                                <td
                                    className={`p-2 border-b pl-5 ${order.paymentInfo.status === "succeeded"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {order.paymentInfo.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {Math.ceil(orders.length / itemsPerPage)}
                </span>
                <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}
                    onClick={() =>
                        setCurrentPage((prev) =>
                            Math.min(prev + 1, Math.ceil(orders.length / itemsPerPage))
                        )
                    }
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrdersGrid;
