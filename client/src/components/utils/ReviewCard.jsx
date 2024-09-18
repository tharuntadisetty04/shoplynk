import React from "react";
import ReactStars from "react-rating-stars-component";
import { FaUser } from "react-icons/fa6";

const ReviewModal = ({ review, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-neutral-100 p-6 rounded-lg max-w-md md:w-full w-[21rem]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Review by {review.name}</h2>
                    <button onClick={onClose} className="text-red-500 text-lg font-bold">
                        X
                    </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="text-xl border-4 border-blue-600 rounded-full p-2.5">
                        <FaUser />
                    </div>
                    <div>
                        <ReactStars
                            count={5}
                            value={review.rating}
                            size={18}
                            color="gray"
                            activeColor="blue"
                            edit={false}
                            isHalf={true}
                        />
                    </div>
                </div>
                <p>{review.comment}</p>
            </div>
        </div>
    );
};

const ReviewCard = ({ review, onClick }) => {
    const ratingOptions = {
        count: 5,
        value: review.rating,
        size: 18,
        color: "gray",
        activeColor: "blue",
        edit: false,
        isHalf: true,
    };

    return (
        <div
            className="duration-200 rounded hover:shadow-md w-full cursor-pointer"
            onClick={() => onClick(review)}
        >
            <div className="border-2 border-slate-200 rounded flex items-start justify-center flex-col gap-2 px-4 py-3 w-full h-fit">
                <div className="flex items-center justify-start gap-2 border-b-2 border-slate-200 w-full pb-2">
                    <div className="text-xl border-4 border-blue-600 rounded-full p-2.5">
                        <FaUser />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium text-lg -mb-1.5 pl-1">{review.name}</p>
                        <ReactStars {...ratingOptions} />
                    </div>
                </div>
                <p className="comment text-start line-clamp-1 pl-1">{review.comment}</p>
            </div>
        </div>
    );
};

export { ReviewCard, ReviewModal };
