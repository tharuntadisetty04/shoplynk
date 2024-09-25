import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    clearErrors,
    deleteProductReview,
    getProductDetails,
} from "../../redux/actions/ProductAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactStars from "react-rating-stars-component";
import { TbTruckDelivery } from "react-icons/tb";
import { RiExchangeLine } from "react-icons/ri";
import { ReviewCard, ReviewModal } from "../utils/ReviewCard";
import ItemLoader from "../layout/ItemLoader";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Modal from "react-modal";
import TitleHelmet from "../utils/TitleHelmet";
import SimilarProducts from "../utils/SimilarProducts";
import ProductNotFound from "./ProductNotFound";
import { addItemsToCart } from "../../redux/actions/cartAction";
import CreateReviewModal from "../utils/CreateReviewModal";

Modal.setAppElement("#root");

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { loading, error, product } = useSelector(
        (state) => state.productDetails
    );
    const { isDeleted, error: deleteError } = useSelector(
        (state) => state.deleteReview
    );

    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);
    const discountPercent = sessionStorage.getItem("discountPercent");

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        dispatch(getProductDetails(id));
    }, [dispatch, error, id]);

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (isDeleted) {
            toast.success("Review deleted successfully!", {
                autoClose: 1800,
            });

            dispatch({ type: "DELETE_REVIEW_RESET" });

            setTimeout(() => {
                dispatch(getProductDetails(id));
            }, 2000);
        }
    }, [dispatch, deleteError, isDeleted]);

    useEffect(() => {
        if (product?.images) {
            setMainImage(product.images[0].url);
        }
    }, [product]);

    let displayedImages = [];
    let extraImageCount = 0;

    if (product && product.images) {
        displayedImages = product.images.slice(0, 4);
        extraImageCount = product.images.length - 4;
    }

    let displayedReviews = [];

    if (product.reviews) {
        displayedReviews = product.reviews.slice(0, 12);
    }

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setQuantity("");
            return;
        }

        const parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue)) {
            toast.warning("Enter a valid Quantity");
        } else if (parsedValue < 1) {
            toast.warning("Quantity cannot be less than 1!");
            setQuantity(1);
        } else if (parsedValue > product.stock) {
            setQuantity(product.stock);
        } else {
            setQuantity(parsedValue);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            toast.warning("Quantity cannot be less than 1");
        }
    };

    const increaseQuantity = () => {
        if (quantity >= product.stock) {
            toast.warning(`Stock limit exceeded. Max: ${product.stock}`);
        } else {
            setQuantity(quantity + 1);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openReviewModal = (review) => {
        setSelectedReview(review);
        setIsReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setIsModalOpen(false);
        setIsReviewModalOpen(null);
    };

    const addToCart = () => {
        if (!error) {
            dispatch(addItemsToCart(id, quantity));
            toast.success("Item added to cart");
        }
    };

    const ratingOptions = {
        count: 5,
        value: product.rating,
        size: window.innerWidth > 600 ? 22 : 20,
        color: "gray",
        activeColor: "blue",
        edit: false,
        isHalf: true,
    };

    const openCreateReviewModal = () => {
        setIsCreateReviewModalOpen(true);
    };

    const closeCreateReviewModal = () => {
        setIsCreateReviewModalOpen(false);
    };

    const deleteReview = (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            if (!deleteError) {
                dispatch(deleteProductReview(id, reviewId));
            }
        }
    };

    return Object.keys(product).length === 0 && error ? (
        <ProductNotFound />
    ) : (
        <div className="product-details w-full h-full flex flex-col justify-center items-center">
            <TitleHelmet title={"Product Details | ShopLynk"} />

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

            {/* product details */}
            {loading ? (
                <ItemLoader />
            ) : (
                <div className="product w-full h-full lg:pb-4 px-8 md:px-16 flex items-center justify-center md:flex-row flex-col lg:gap-8 md:gap-6 gap-4 md:mt-2">
                    {/* Left Column - Images */}
                    <div className="images flex lg:flex-row flex-col-reverse justify-center items-center lg:gap-8 gap-3">
                        <div className="other-img flex lg:flex-col lg:gap-3 gap-2 items-center justify-between">
                            {displayedImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative lg:w-20 lg:h-20 md:w-16 md:h-16 w-14 h-14 flex items-center justify-center border border-slate-200 cursor-pointer rounded"
                                >
                                    <img
                                        src={image.url}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full rounded object-cover aspect-square"
                                        onClick={() => setMainImage(image.url)}
                                    />

                                    {index === 3 && extraImageCount > 0 && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-neutral-100 text-lg font-semibold rounded"
                                            onClick={openModal}
                                        >
                                            +{extraImageCount}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="main-img lg:w-full lg:h-[30rem] md:w-80 md:h-96 w-full h-[19rem] grid place-items-center rounded">
                            {mainImage && (
                                <img
                                    src={mainImage}
                                    alt="Product Image - 1"
                                    className="object-contain rounded md:h-96 h-72"
                                    width={400}
                                />
                            )}
                        </div>

                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            className="fixed inset-0 p-2 rounded w-4/5 md:w-2/3 mx-auto flex flex-col justify-center border-none outline-none"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-50 bg-whsite"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 bg-transparent text-xl cursor-pointer text-red-500 font-bold"
                            >
                                X
                            </button>

                            <Carousel
                                className="w-full bg-neutral-100 rounded"
                                showThumbs={true}
                                thumbWidth={80}
                                useKeyboardArrows={true}
                                emulateTouch={true}
                            >
                                {product.images &&
                                    product.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="mt-6 md:w-full md:h-96 h-fit w-fit mx-auto mb-8 rounded"
                                        >
                                            <img
                                                src={image.url}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-contain aspect-square rounded"
                                            />
                                        </div>
                                    ))}
                            </Carousel>
                        </Modal>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="details flex flex-col items-start px-2 max-w-96">
                        <div className="md:-mt-16 lg:-mt-6">
                            <h2 className="text-2xl font-semibold">{product.name}</h2>

                            <div className="flex items-center">
                                <ReactStars {...ratingOptions} />
                                <span className="text-sm text-gray-600 mx-1">
                                    ({product.numOfReviews} Reviews) |
                                </span>

                                <span
                                    className={
                                        product.stock < 1
                                            ? "text-red-500 pl-1 text-sm font-medium"
                                            : "text-green-500 pl-1 text-sm font-medium"
                                    }
                                >
                                    {product.stock < 1 ? "Out of Stock" : "In Stock"}
                                </span>
                            </div>

                            <div className="text-2xl font-semibold md:mt-2 mt-1">
                                <span>₹{product.price}</span>
                                <span className="line-through text-lg text-gray-500 font-medium pl-2">
                                    ₹{product.price + Math.floor(product.price * (discountPercent / 100))}
                                </span>
                            </div>

                            <p className="text-gray-700 mt-1 text-base">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-2 flex items-center">
                            <button
                                className={`duration-200 border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-600 hover:text-neutral-100 hover:border-blue-600 px-3 rounded font-semibold text-xl ${product?.stock < 1 ? "cursor-not-allowed" : "cursor-auto"
                                    }`}
                                onClick={decreaseQuantity}
                                disabled={product?.stock < 1}
                            >
                                -
                            </button>

                            <input
                                type="text"
                                value={quantity}
                                className={`w-12 h-[1.92rem] text-center mx-2 border-2 border-blue-600 rounded outline-none bg-white ${product?.stock < 1 ? "cursor-not-allowed" : "cursor-auto"
                                    }`}
                                onChange={handleQuantityChange}
                                disabled={product?.stock < 1}
                            />

                            <button
                                className={`duration-200 border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-600 hover:text-neutral-100 hover:border-blue-600 px-3 rounded font-semibold text-xl ${product?.stock < 1 ? "cursor-not-allowed" : "cursor-auto"
                                    }`}
                                onClick={increaseQuantity}
                                disabled={product?.stock < 1}
                            >
                                +
                            </button>

                            <button
                                className={`rounded bg-blue-600 p-2 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 lg:text-sm md:text-xs text-sm ml-4 ${product?.stock < 1
                                    ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-500"
                                    }`}
                                onClick={addToCart}
                                disabled={product?.stock < 1}
                            >
                                Add to Cart
                            </button>
                        </div>

                        <div className="flex flex-col">
                            <div className="mt-4 flex items-center">
                                <div className="text-4xl">
                                    <TbTruckDelivery />
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-sm ml-2 font-medium">Fast Delivery</p>
                                    <p className="text-sm text-gray-500 ml-2">
                                        Enter your postal code for Delivery Availability
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center">
                                <div className="text-4xl">
                                    <RiExchangeLine />
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-sm ml-2 font-medium">Return Delivery</p>
                                    <p className="text-sm text-gray-500 ml-2">
                                        Free 30 Days Delivery Returns
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews section */}
            <div className="reviews w-full h-fit py-4 px-8 md:px-16 mt-3 lg:mt-0">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Product <span className="text-blue-600">Reviews</span>
                    </h2>

                    <button
                        className="rounded-md bg-blue-600 md:px-3.5 px-2 md:py-2 py-1.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 text-center"
                        onClick={openCreateReviewModal}
                    >
                        Submit Review
                    </button>
                </div>

                <CreateReviewModal
                    productId={id}
                    isOpen={isCreateReviewModalOpen}
                    onModalClose={closeCreateReviewModal}
                />

                {loading ? (
                    <ItemLoader />
                ) : (
                    <div>
                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 place-items-center gap-6">
                                {displayedReviews &&
                                    displayedReviews.map((review) => (
                                        <ReviewCard
                                            key={review._id}
                                            review={review}
                                            onClick={openReviewModal}
                                            onDelete={deleteReview}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-center p-6 text-3xl font-semibold">
                                No Reviews Yet
                            </p>
                        )}

                        <ReviewModal
                            review={selectedReview}
                            isOpen={isReviewModalOpen}
                            onClose={closeReviewModal}
                        />
                    </div>
                )}
            </div>

            {/* similar products */}
            {loading ? <ItemLoader /> : <SimilarProducts />}
        </div>
    );
};

export default ProductDetails;
