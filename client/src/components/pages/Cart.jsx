import { useEffect, useState } from "react";
import CartItem from "../utils/CartItem";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

const Cart = () => {
    const navigate = useNavigate();

    const { cartItems } = useSelector((state) => state.cart);
    const userLoggedIn = useSelector((state) => state.user.isAuthenticated);
    const [discountPercent, setDiscountPercent] = useState(0);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const getRandomDiscount = (min, max) => {
        const random = Math.random() * (max - min) + min;
        return parseInt(random);
    };

    useEffect(() => {
        const savedDiscount = sessionStorage.getItem("discountPercent");

        if (savedDiscount) {
            setDiscountPercent(parseInt(savedDiscount));
        } else {
            const newDiscount = getRandomDiscount(5, 30);
            sessionStorage.setItem("discountPercent", newDiscount);
            setDiscountPercent(newDiscount);
        }
    }, []);

    const tax = Math.floor(totalPrice * 0.18);
    const deliveryCharges = totalPrice < 5000 ? 0 : 200;
    const discount = Math.floor((totalPrice * discountPercent) / 100);
    const totalAmount = Math.floor(totalPrice + tax + deliveryCharges - discount);

    const checkoutHandler = () => {
        if (userLoggedIn) {
            navigate("/shipping");
        } else {
            navigate("/login?redirect=shipping");
        }
    };

    return cartItems.length > 0 ? (
        <div className="cart w-full h-full lg:min-h-[60svh] md:min-h-[65svh]">
            <TitleHelmet title={"Shopping Cart | ShopLynk"} />

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

            <h2 className="text-2xl md:text-3xl font-bold text-center">
                Shopping <span className="text-blue-600">Cart</span>
            </h2>

            <div className="pb-2 px-8 md:px-16 flex flex-col lg:flex-row md:gap-4 lg:justify-between justify-center lg:items-start items-center">
                <div className="mx-auto py-3 lg:w-3/4 w-full">
                    <div className="md:grid grid-cols-4 gap-4 font-semibold text-lg md:pb-1 hidden">
                        <span className="text-center">Product</span>
                        <span className="text-center lg:pl-24 pl-28">Quantity</span>
                        <span className="text-center lg:-ml-3 md:pl-16 lg:pl-0">Price</span>
                        <span className="text-start pl-4">Subtotal</span>
                    </div>

                    <div className="flex flex-col">
                        {cartItems &&
                            cartItems.map((item) => (
                                <CartItem key={item.product} item={item} />
                            ))}
                    </div>
                </div>

                <div className="bg-white p-4 shadow-md rounded-md h-full md:w-3/4 w-full lg:w-1/4 lg:sticky lg:top-1 lg:mt-11 mb-2 lg:mb-0">
                    <h2 className="text-lg font-semibold mb-4">PRICE DETAILS</h2>

                    <div className="space-y-2">
                        <div className="flex justify-between font-medium">
                            <span>Price ({cartItems.length} items)</span>
                            <span>{totalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between font-medium">
                            <span>Delivery Charges</span>
                            <span className="text-blue-600">
                                + {deliveryCharges.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between font-medium">
                            <span>GST (18%)</span>
                            <span className="text-blue-600">+ {tax.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between font-medium">
                            <span>Discount ({discountPercent}%)</span>
                            <span className="text-blue-600">- {discount.toFixed(2)}</span>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mt-4 space-x-4">
                        <Link
                            to="/products"
                            className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded font-medium"
                        >
                            Shop More
                        </Link>

                        <button
                            className="px-4 py-2 bg-blue-600 text-neutral-100 rounded font-medium shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                            onClick={checkoutHandler}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="w-full h-[60svh] flex items-center justify-center">
            <div className="text-center mx-auto">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl flex gap-2 justify-center">
                    <span className="text-blue-600">
                        <MdOutlineRemoveShoppingCart />
                    </span>
                    <span>No Items in Cart</span>
                </h1>

                <p className="mt-6 text-base leading-7 text-gray-600">
                    Sorry, there are no products in your cart. Continue shopping to add
                    items.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/products"
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
