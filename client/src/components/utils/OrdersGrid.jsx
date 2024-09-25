import React, { useMemo, useState } from "react";

const OrdersGrid = ({ orders }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const getOrderStatus = useMemo(
        () => (orderItems) =>
            orderItems.every((item) => item.orderStatus === "Delivered")
                ? "Delivered"
                : orderItems.some((item) => item.orderStatus === "Shipped")
                    ? "Shipped"
                    : "Processing",
        []
    );

    const sortedData = useMemo(() => {
        if (sortConfig.key) {
            return [...orders].sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === "status") {
                    aValue = getOrderStatus(a.orderItems);
                    bValue = getOrderStatus(b.orderItems);

                    const statusMap = {
                        Processing: 1,
                        Shipped: 2,
                        Delivered: 3,
                    };
                    aValue = statusMap[aValue];
                    bValue = statusMap[bValue];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return orders;
    }, [orders, sortConfig, getOrderStatus]);

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
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-slate-200">
                        <tr>
                            <th
                                className="p-3 text-left cursor-pointer"
                                onClick={() => requestSort("_id")}
                            >
                                Order ID{" "}
                                {sortConfig.key === "_id" &&
                                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                            </th>
                            <th className="p-3 text-left lg:pl-20">Items</th>
                            <th
                                className="p-3 text-left cursor-pointer"
                                onClick={() => requestSort("totalPrice")}
                            >
                                Total Price{" "}
                                {sortConfig.key === "totalPrice" &&
                                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                            </th>
                            <th
                                className="p-3 text-left cursor-pointer"
                                onClick={() => requestSort("status")}
                            >
                                Order Status{" "}
                                {sortConfig.key === "status" &&
                                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                            </th>
                            <th className="p-3 text-left lg:pl-28">Shipping Address</th>
                            <th className="p-3 text-left">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="p-3 border-b">{order._id}</td>
                                <td className="p-3 border-b">
                                    {order.orderItems.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 mb-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md lg:block hidden"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-semibold">
                                                    {item.name.length > 15
                                                        ? `${item.name.slice(0, 15)}...`
                                                        : item.name}
                                                </span>
                                                <span className="text-sm">
                                                    Quantity: {item.quantity}
                                                </span>
                                                <span className="text-sm">Price: ₹{item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {order.orderItems.length > 3 && (
                                        <span className="font-semibold">
                                            ... and {order.orderItems.length - 3} others
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 border-b text-left pl-5">
                                    ₹{order.totalPrice}
                                </td>
                                <td
                                    className={`p-3 border-b text-left ${getOrderStatus(order.orderItems) === "Delivered"
                                        ? "text-green-600"
                                        : getOrderStatus(order.orderItems) === "Shipped"
                                            ? "text-orange-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {getOrderStatus(order.orderItems)}
                                </td>
                                <td className="p-3 border-b text-left">
                                    <span>
                                        {order.shippingInfo.address.length > 20
                                            ? `${order.shippingInfo.address.slice(0, 20)}...`
                                            : order.shippingInfo.address}
                                    </span>
                                    , {order.shippingInfo.city}, {order.shippingInfo.state},{" "}
                                    {order.shippingInfo.country} - {order.shippingInfo.pincode}
                                </td>
                                <td
                                    className={`p-3 border-b lg:pl-8 ${order.paymentInfo?.status === "succeeded"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {order.paymentInfo?.status === "succeeded"
                                        ? "Success"
                                        : "Failed"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {Math.ceil(orders.length / itemsPerPage)}
                </span>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
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
