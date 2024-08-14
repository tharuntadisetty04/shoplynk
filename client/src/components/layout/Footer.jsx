import React, { useState, useEffect } from "react";
import { FaArrowRight, FaFacebook } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {
        if (!showScroll && window.scrollY > 50 && screen.width >= 1024) {
            setShowScroll(true);
        } else if (showScroll && window.scrollY <= 50) {
            setShowScroll(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", checkScrollTop);
        return () => {
            window.removeEventListener("scroll", checkScrollTop);
        };
    }, [showScroll]);

    return (
        <footer className="flex flex-col gap-2 bg-slate-200 py-4 w-full mt-2">
            {/* Top footer */}
            <div className="main-top flex flex-col lg:flex-row justify-center gap-2 lg:gap-36 px-8 md:px-16">
                {/* Newsletter section */}
                <div className="newsletter flex flex-col">
                    <h2 className="font-semibold text-lg mb-1">Join our Newsletter</h2>
                    <div className="flex flex-col md:flex-row lg:flex-col">
                        <p>Drop your email below to get updates about us,</p>
                        <p>latest news, tips, and more!</p>
                    </div>

                    <div className="flex items-center py-2 md:pt-4 gap-2">
                        <input
                            type="email"
                            aria-label="Email"
                            className="md:w-1/2 lg:w-fit outline-none border-2 border-white bg-white focus:border-blue-600 px-2 py-1 rounded-md font-medium"
                            placeholder="Enter your email"
                        />
                        <button
                            aria-label="Submit"
                            className="hover:cursor-pointer duration-200 border-2 border-white bg-white text-blue-700 hover:bg-blue-600 hover:text-slate-100 hover:border-blue-600 px-3 py-2 rounded-md font-medium"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>

                {/* Footer links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:gap-28 gap-x-2">
                    <div className="product-links">
                        <h2 className="font-semibold text-lg mb-1">Product Links</h2>
                        <ul>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/products">Categories</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/products">New Arrival</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/products">Features</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/products">Collections</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="company-links">
                        <h2 className="font-semibold text-lg mb-1">Company</h2>
                        <ul>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/about">About</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/about">Blog</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/about">Careers</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="support-links">
                        <h2 className="font-semibold text-lg mb-1">Support</h2>
                        <ul>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/contact">Support Center</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/contact">FAQ</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/contact">Privacy Policy</Link>
                            </li>
                            <li className="hover:text-blue-600 duration-200">
                                <Link to="/contact">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="social-icons">
                        <h2 className="font-semibold text-lg mb-2">Get In Touch</h2>

                        <ul className="flex lg:flex-row items-center md:justify-start gap-5">
                            <li className="text-2xl font-bold hover:text-blue-600 duration-200 cursor-pointer">
                                <FaFacebook />
                            </li>
                            <li className="text-2xl font-bold hover:text-blue-600 duration-200 cursor-pointer">
                                <FaXTwitter />
                            </li>
                            <li className="text-2xl font-extrabold hover:text-blue-600 duration-200 cursor-pointer">
                                <FaInstagram />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom footer */}
            <div className="w-full text-center text-sm text-gray-600 mt-1">
                <p>&copy;2024 ShopLynk. All Rights Reserved.</p>
                <span>
                    For any Queries contact{" "}
                    <span className="text-blue-500 font-medium">
                        mail.for.dev.tharun@gmail.com
                    </span>
                </span>
            </div>

            {/* scroll to top button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-6 text-4xl hover:text-blue-600 duration-200 cursor-pointer ${showScroll ? "block" : "hidden"
                    }`}
            >
                <IoArrowUpCircleOutline />
            </button>
        </footer>
    );
};

export default Footer;
