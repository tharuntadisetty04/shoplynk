import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    clearErrors,
    getSimilarProducts,
} from "../../redux/actions/ProductAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "../utils/ProductCard";
import ItemLoader from "../layout/ItemLoader";

const SimilarProducts = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { loading, error, similarProducts } = useSelector(
        (state) => state.similarProducts
    );

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }
        dispatch(getSimilarProducts(id));
    }, [dispatch, id, error]);

    return (
        <div className="similar-products w-full h-fit py-4 px-8 md:px-16">
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

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                    Similar <span className="text-blue-600">Products</span>
                </h2>

                <Link
                    to="/products"
                    className="rounded-md bg-blue-600 md:px-3.5 px-2 md:py-2 py-1.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 text-center"
                >
                    View All
                </Link>
            </div>

            {loading ? (
                <ItemLoader />
            ) : !similarProducts || similarProducts.length === 0 ? (
                <div className="text-center p-6 text-3xl font-semibold">
                    No Similar Products found
                </div>
            ) : (
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 place-items-center gap-8">
                    {similarProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SimilarProducts;
