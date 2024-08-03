import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const options = {
    edit: false,
    color: "gray",
    activeColor: "blue",
    value: 3.5,
    isHalf: true,
    size: 20,
};

const Product = ({ product }) => {
    return (
        <Link
            to={product._id}
            className="border-2 border-slate-200 rounded-sm duration-300 hover:-translate-y-2 hover:shadow-md"
        >
            <div className="product-image">
                <img
                    src={product.image[0].url}
                    alt={product.name}
                    loading="lazy"
                    width={300}
                />
            </div>

            <div className="product-details py-3 px-4 flex flex-col items-start justify-center gap-1">
                <div>
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <div className="text-sm font-medium flex gap-1">
                        <ReactStars {...options} />
                        <span>(200)</span>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full">
                    <div>
                        <span className="font-bold text-xl pr-1">₹{product.price}</span>
                        <span className="line-through text-sm text-gray-500 font-medium">
                            ₹{product.price + product.price * (20 / 100)}
                        </span>
                    </div>

                    <button className="rounded-md bg-blue-600 p-2 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 text-sm">
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default Product;
