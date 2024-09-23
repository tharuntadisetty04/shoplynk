import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearErrors,
    deleteProduct,
    getSellerProducts,
} from "../../redux/actions/ProductAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleHelmet from "../utils/TitleHelmet";
import { Link, useNavigate } from "react-router-dom";
import ItemLoader from "../layout/ItemLoader";
import { RiEdit2Line } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { DELETE_PRODUCT_RESET } from "../../redux/constants/ProductConstant";

const SellerProducts = ({ setActiveTab, updateProductHandler }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, products, productsCount } = useSelector(
        (state) => state.products
    );
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const {
        isDeleted,
        error: deleteError,
        loading: deleteLoading,
    } = useSelector((state) => state.modifiedProduct);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        if (error) {
            toast.error(error, { onClose: () => dispatch(clearErrors()) });
        }

        if (deleteError) {
            toast.error(deleteError, { onClose: () => dispatch(clearErrors()) });
        }

        if (!isAuthenticated) {
            navigate("/login");
        }

        if (isDeleted) {
            dispatch(getSellerProducts());
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

        if (isAuthenticated && !deleteError) {
            dispatch(getSellerProducts());
        }
    }, [dispatch, error, deleteError, isAuthenticated, navigate, isDeleted]);

    const sortedProducts = useMemo(() => {
        if (sortConfig.key) {
            return [...products].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return products;
    }, [products, sortConfig]);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = sortedProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const totalPages = Math.ceil(productsCount / itemsPerPage);

    const deleteProductHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id));
            toast.success("Product deleted successfully!");
        }
    };

    return loading ? (
        <ItemLoader />
    ) : (
        <div className="seller-products w-full h-full p-4 -mt-6 lg:mt-0">
            <TitleHelmet title={`${user?.username}'s Products | ShopLynk`} />

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

            {productsCount !== 0 ? (
                <>
                    <div className="flex flex-col md:flex-row items-center justify-between -mt-1 mb-4">
                        <h2 className="text-2xl font-bold text-center">
                            {user?.username}'s <span className="text-blue-600">Products</span>
                        </h2>

                        <div className="flex items-center gap-2">
                            <p>Per Page: </p>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="px-2 py-1 border rounded focus-visible:outline-blue-600"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                    </div>

                    <div className="product-section w-full overflow-x-auto">
                        <table className="min-w-full bg-white shadow border">
                            <thead className="bg-slate-200">
                                <tr>
                                    {["Product ID", "name", "stock", "price"].map((key) => (
                                        <th
                                            key={key}
                                            className="px-6 py-3 border-b-2 text-left cursor-pointer"
                                            onClick={() => requestSort(key)}
                                        >
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                            {sortConfig.key === key
                                                ? sortConfig.direction === "asc"
                                                    ? " ▲"
                                                    : " ▼"
                                                : null}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 border-b-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-2">
                                            <Link
                                                // to={`/products/${product._id}`}
                                                to={`/admin/dashboard/product/${product._id}`}
                                                className="hover:text-blue-600 duration-200"
                                            >
                                                {product._id}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-2">
                                            {product.name.length > 45
                                                ? `${product.name.slice(0, 45)}...`
                                                : product.name}
                                        </td>
                                        <td className="px-6 py-2">{product.stock}</td>
                                        <td className="px-6 py-2">{product.price}</td>
                                        <td className="px-6 py-2 flex items-center space-x-2">
                                            <button
                                                className="text-gray-600 hover:text-blue-600 duration-200 text-xl"
                                                onClick={() => updateProductHandler(product?._id)}
                                            >
                                                <RiEdit2Line />
                                            </button>
                                            <span>|</span>
                                            <button
                                                className="text-gray-600 hover:text-red-600 duration-200 text-xl"
                                                onClick={() => deleteProductHandler(product?._id)}
                                                disabled={deleteLoading}
                                            >
                                                <MdDeleteOutline />
                                            </button>
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
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-md disabled:opacity-50"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full lg:min-h-[50svh] md:min-h-[30svh]">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl mb-4 text-center">
                        No Products Available
                    </h1>
                    <p className="text-gray-600 mb-6 text-center">
                        It looks like you haven't added any products yet. Start by adding
                        your first product!
                    </p>
                    <button
                        className="px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition"
                        onClick={() => setActiveTab("create-product")}
                    >
                        Add Product
                    </button>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
