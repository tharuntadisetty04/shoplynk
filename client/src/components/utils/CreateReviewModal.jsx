import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactStars from "react-rating-stars-component";
import {
    clearErrors,
    createProductReview,
    getProductDetails,
} from "../../redux/actions/ProductAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { NEW_REVIEW_RESET } from "../../redux/constants/ProductConstant";

const CreateReviewSchema = z.object({
    rating: z.number().min(1, "Rating is required"),
    comment: z.string().min(1, "Comment is required"),
});

const CreateReviewModal = ({ productId, isOpen, onModalClose }) => {
    if (!isOpen) return null;

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);

    const { loading, error, success } = useSelector((state) => state.newReview);
    const { isAuthenticated } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(CreateReviewSchema),
    });

    const handleRatings = (newRating) => {
        setRating(newRating);
        setValue("rating", newRating);
    };

    const handleModalClose = () => {
        if (window.innerWidth > 1000) {
            onModalClose();
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (success) {
            toast.success("Review submitted successfully!", {
                autoClose: 1200,
                onClose: () => {
                    onModalClose();
                    dispatch(getProductDetails(productId));
                },
            });
            dispatch({ type: NEW_REVIEW_RESET });
        }
    }, [dispatch, error, success]);

    const onSubmit = (data) => {
        if (!isAuthenticated) {
            navigate("/login");
        }

        data.productId = id;
        dispatch(createProductReview(data));
        reset();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleModalClose}
        >
            <div
                className="bg-neutral-100 p-6 rounded-lg max-w-md md:w-full w-[21rem]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Submit Review</h2>
                    <button
                        onClick={onModalClose}
                        className="text-red-500 text-lg font-bold"
                        disabled={loading}
                    >
                        X
                    </button>
                </div>

                <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-lg">Ratings: </span>
                        <ReactStars
                            count={5}
                            size={22}
                            value={rating}
                            isHalf={true}
                            activeColor="blue"
                            onChange={handleRatings}
                        />
                        {errors.rating && (
                            <p className="text-red-500 text-sm font-medium">
                                {errors.rating.message}
                            </p>
                        )}
                    </div>

                    <textarea
                        {...register("comment")}
                        name="comment"
                        id="comment"
                        rows={3}
                        className="resize-none outline-none p-2 rounded w-full"
                        placeholder="Write a comment"
                    ></textarea>
                    {errors.comment && (
                        <p className="text-red-500 text-sm">{errors.comment.message}</p>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 w-fit font-semibold text-neutral-100 hover:bg-blue-500 duration-200"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReviewModal;
