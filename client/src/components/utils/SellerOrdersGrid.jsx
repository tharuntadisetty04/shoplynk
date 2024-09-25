import { useEffect, useMemo, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { clearErrors, deleteOrder } from "../../redux/actions/orderAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_ORDER_RESET } from "../../redux/constants/orderConstant";

const SellerOrdersGrid = ({ orders, updateOrderHandler, fetchOrders }) => {
    const dispatch = useDispatch();
    const { loading, error, isDeleted } = useSelector(
        (state) => state.modifiedOrder
    );

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (error) {
            toast.error(error, { onClose: () => dispatch(clearErrors()) });
        }

        if (isDeleted) {
            toast.success("Order deleted successfully!", {
                onClose: () => fetchOrders(),
                autoClose: 1800,
            });

            dispatch({ type: DELETE_ORDER_RESET });
        }
    }, [error, isDeleted, dispatch]);

    const sortingKeys = {
        "Order ID": "_id",
        Amount: "totalPrice",
        Status: "status",
        "Items Qty": "itemsQty",
    };

    const getOrderStatus = useMemo(
        () => (orderItems) => {
            const status = orderItems.every(
                (item) => item.orderStatus === "Delivered"
            )
                ? "Delivered"
                : orderItems.some((item) => item.orderStatus === "Shipped")
                    ? "Shipped"
                    : "Processing";

            switch (status) {
                case "Delivered":
                    return 3;
                case "Shipped":
                    return 2;
                default:
                    return 1;
            }
        },
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
                }

                if (sortConfig.key === "itemsQty") {
                    aValue = a.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                    bValue = b.orderItems.reduce((sum, item) => sum + item.quantity, 0);
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
        const actualKey = sortingKeys[key];
        let direction = "asc";
        if (sortConfig.key === actualKey && sortConfig.direction === "asc") {
            direction = "desc";
        }

        setSortConfig({ key: actualKey, direction });
    };

    const deleteOrderHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            dispatch(deleteOrder(id));
        }
    };

    return (
        <div className="lg:p-4 py-4">
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

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                    <thead className="bg-slate-200">
                        <tr>
                            <th
                                className="p-2 text-left cursor-pointer lg:pl-4"
                                onClick={() => requestSort("Order ID")}
                            >
                                Order ID
                                {sortConfig.key === "_id"
                                    ? sortConfig.direction === "asc"
                                        ? " ▲"
                                        : " ▼"
                                    : null}
                            </th>

                            <th
                                className="p-2 text-left cursor-pointer lg:pl-6"
                                onClick={() => requestSort("Status")}
                            >
                                Status
                                {sortConfig.key === "status"
                                    ? sortConfig.direction === "asc"
                                        ? " ▲"
                                        : " ▼"
                                    : null}
                            </th>

                            <th
                                className="p-2 text-left cursor-pointer"
                                onClick={() => requestSort("Items Qty")}
                            >
                                Items Qty
                                {sortConfig.key === "itemsQty"
                                    ? sortConfig.direction === "asc"
                                        ? " ▲"
                                        : " ▼"
                                    : null}
                            </th>

                            <th
                                className="p-2 text-left cursor-pointer lg:pl-2.5"
                                onClick={() => requestSort("Amount")}
                            >
                                Amount
                                {sortConfig.key === "totalPrice"
                                    ? sortConfig.direction === "asc"
                                        ? " ▲"
                                        : " ▼"
                                    : null}
                            </th>

                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="p-4 border-b">{order._id}</td>

                                <td
                                    className={`p-3 border-b text-left ${getOrderStatus(order.orderItems) === 3
                                        ? "text-green-600"
                                        : getOrderStatus(order.orderItems) === 2
                                            ? "text-orange-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {getOrderStatus(order.orderItems) === 3
                                        ? "Delivered"
                                        : getOrderStatus(order.orderItems) === 2
                                            ? "Shipped"
                                            : "Processing"}
                                </td>

                                <td className="p-4 border-b lg:pl-8">
                                    {order.orderItems.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                    )}
                                </td>

                                <td className="p-4 border-b">
                                    {"₹" + order.totalPrice.toLocaleString()}
                                </td>

                                <td className="p-4 border-b">
                                    <div className="flex items-center gap-3 justify-center">
                                        <button
                                            className="text-gray-600 hover:text-blue-600 text-xl"
                                            onClick={() => updateOrderHandler(order?._id)}
                                        >
                                            <RiEdit2Line />
                                        </button>

                                        <span className="text-gray-400">|</span>

                                        <button
                                            className="text-gray-600 hover:text-red-600 text-xl"
                                            onClick={() => deleteOrderHandler(order?._id)}
                                            disabled={loading}
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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

export default SellerOrdersGrid;
