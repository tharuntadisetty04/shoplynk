import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleHelmet from "../utils/TitleHelmet";
import ItemLoader from "../layout/Loaders/ItemLoader";
import {
    getProductReviews,
    clearErrors,
} from "../../redux/actions/ProductAction";

const SellerProductReviews = () => {
    const dispatch = useDispatch();
    const { loading, error, reviews } = useSelector((state) => state.allReviews);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [productId, setProductId] = useState("");
    const [debouncedProductId, setDebouncedProductId] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedProductId(productId);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [productId]);

    useEffect(() => {
        if (error) {
            toast.error(error, { onClose: () => dispatch(clearErrors()) });
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (debouncedProductId) {
            dispatch(getProductReviews(debouncedProductId));
        }
    }, [dispatch, debouncedProductId]);

    const sortedReviews = useMemo(() => {
        if (sortConfig.key) {
            return [...reviews].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return reviews;
    }, [reviews, sortConfig]);

    const currentReviews = useMemo(() => {
        const indexOfLastReview = currentPage * itemsPerPage;
        const indexOfFirstReview = indexOfLastReview - itemsPerPage;
        return sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
    }, [sortedReviews, currentPage, itemsPerPage]);

    const sortingKeys = {
        "Review ID": "_id",
        User: "name",
        Comment: "comment",
        Rating: "rating",
    };

    const requestSort = (key) => {
        const actualKey = sortingKeys[key];
        let direction = "asc";
        if (sortConfig.key === actualKey && sortConfig.direction === "asc") {
            direction = "desc";
        }

        setSortConfig({ key: actualKey, direction });
    };

    const totalPages = Math.ceil(reviews?.length / itemsPerPage);

    const getReviewHandler = (e) => {
        const id = e.target.value;

        if (id.length > 0 && id !== "") {
            setProductId(id);
        }
    };

    return loading ? (
        <ItemLoader />
    ) : (
        <div className="product-reviews w-full h-full p-4 -mt-6 lg:mt-0">
            <TitleHelmet title={"Product Reviews | ShopLynk"} />

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

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2 md:gap-0">
                <div>
                    <label className="font-medium text-xl">Enter Product ID: </label>

                    <input
                        type="text"
                        value={productId}
                        placeholder="Enter Product ID"
                        className="outline-none border-2 border-slate-200 focus:border-blue-600 px-2 py-1 rounded duration-200"
                        onChange={getReviewHandler}
                    />
                </div>

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

            {reviews && reviews.length !== 0 ? (
                <>
                    <div className="review-section w-full overflow-x-auto">
                        <table className="min-w-full bg-white shadow border">
                            <thead className="bg-slate-200">
                                <tr>
                                    {["Review ID", "User", "Comment", "Rating"].map((key) => (
                                        <th
                                            key={key}
                                            className="px-6 py-3 border-b-2 text-left cursor-pointer"
                                            onClick={() => requestSort(key)}
                                        >
                                            {key}
                                            {sortConfig.key === sortingKeys[key]
                                                ? sortConfig.direction === "asc"
                                                    ? " ▲"
                                                    : " ▼"
                                                : null}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentReviews.map((review) => (
                                    <tr key={review._id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-2">{review._id}</td>
                                        <td className="px-6 py-2">{review.name}</td>
                                        <td className="px-6 py-2">
                                            {review?.comment.length > 0 ? review.comment : "-"}
                                        </td>
                                        <td className="px-6 py-2">{review.rating}</td>
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
                        No Reviews Available
                    </h1>

                    <p className="text-gray-600 mb-6 text-center">
                        It looks like there are no reviews yet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SellerProductReviews;
