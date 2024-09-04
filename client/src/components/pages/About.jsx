import React, { useState, useEffect } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import aboutImg from "../../assets/about-img.jpg";
import { AiFillShop } from "react-icons/ai";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FiShoppingBag } from "react-icons/fi";
import { TbMoneybag } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../redux/actions/UserAction";
import ItemLoader from "../layout/ItemLoader";

const About = () => {
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, user } = useSelector(
        (state) => state.user
    );

    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }
    }, [dispatch, error]);

    const faqData = [
        {
            question: "How long does shipping take?",
            answer:
                "Our standard shipping typically takes 3-5 business days within the contiguous United States. International shipping times may vary based on the destination country and customs processing times. We also offer expedited shipping options for customers who need their orders to arrive more quickly.",
        },
        {
            question: "Can I return or exchange items?",
            answer:
                "You can return or exchange items within 30 days of purchase as long as they are in their original condition. Visit our returns page for more details.",
        },
        {
            question: "What sizes do you offer?",
            answer:
                "We offer a wide range of sizes from XS to XXL. Please refer to our size guide for specific measurements.",
        },
        {
            question: "Are your products sustainable?",
            answer:
                "Yes, we are committed to sustainability. Our products are made from eco-friendly materials and our processes aim to minimize environmental impact.",
        },
        {
            question: "How can I contact customer support?",
            answer:
                "You can reach our customer support team via email at support@example.com or call us at 1-800-123-4567.",
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return loading ? (
        <ItemLoader />
    ) : (
        <div className="about w-full h-full">
            <TitleHelmet title={"About | ShopLynk"} />

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

            {/* hero section */}
            <div className="hero-banner w-full lg:h-svh h-full md:flex md:items-center md:justify-between lg:gap-0 gap-4 px-8 md:px-16 md:mb-3 lg:-my-8">
                <div className="left-section flex flex-col gap-4 lg:w-[40rem] md:w-[34rem]">
                    <h1 className="lg:text-5xl md:text-3xl text-2xl font-bold">
                        <span>Our</span>
                        <span className="text-blue-600"> Story</span>
                    </h1>

                    <div className="font-medium md:flex md:flex-col md:my-2 gap-4 text-justify">
                        <p className="text-sm md:text-base">
                            Lorem Ipsum is simply dummy text of the printing and typesetting
                            industry. Lorem Ipsum has been the industry's standard dummy text
                            ever since the 1500s, when an unknown printer took a galley of
                            type and scrambled it to make a type specimen book. It has
                            survived not only five centuries, but also the leap into
                            electronic typesetting, remaining essentially unchanged.
                        </p>
                        <p className="lg:block hidden">
                            Lorem Ipsum is simply dummy text of the printing and typesetting
                            industry. Lorem Ipsum has been the industry's standard dummy text
                            ever since the 1500s, when an unknown printer took a galley of
                            type and scrambled it to make a type specimen.
                        </p>
                    </div>

                    {isAuthenticated && user.role === "seller" ? (
                        ""
                    ) : isAuthenticated && user.role === "buyer" ? (
                        <Link
                            to="/profile"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 w-fit"
                        >
                            Become a Seller
                        </Link>
                    ) : (
                        <Link
                            to="/signup"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 w-fit"
                        >
                            Become a Seller
                        </Link>
                    )}
                </div>

                <div className="right-section mt-4 md:mt-0 w-fit">
                    <img
                        src={aboutImg}
                        alt="Shopping image"
                        width={560}
                        loading="lazy"
                        className="mix-blend-darken"
                    />
                </div>
            </div>

            {/* features and details */}
            <div className="features w-full h-fit py-4 px-8 md:px-16 mb-2">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 place-items-center gap-6">
                    <div className="w-80 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <AiFillShop />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-semibold text-2xl">2.5k</h2>
                            <p className="md:text-center font-medium">
                                Sellers active in our site
                            </p>
                        </div>
                    </div>

                    <div className="w-80 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <RiMoneyRupeeCircleLine />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-semibold text-2xl">13k</h2>
                            <p className="md:text-center font-medium">
                                Monthly product sales
                            </p>
                        </div>
                    </div>

                    <div className="w-80 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <FiShoppingBag />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-semibold text-2xl">8.3k</h2>
                            <p className="md:text-center font-medium">
                                Customers active in our site
                            </p>
                        </div>
                    </div>

                    <div className="w-80 flex md:flex-col px-4 items-center justify-center gap-6 md:gap-3 py-6 border-4 border-slate-200 rounded-md cursor-pointer">
                        <div className="border-4 border-blue-600 p-2 rounded-full text-5xl">
                            <TbMoneybag />
                        </div>

                        <div className="flex flex-col md:items-center">
                            <h2 className="font-semibold text-2xl">28k</h2>
                            <p className="md:text-center font-medium">
                                Annual gross sale in our site
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ section */}
            <div className="w-full h-fit py-4 px-8 md:px-16 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        FAQ <span className="text-blue-600">Section</span>
                    </h2>
                </div>

                {faqData &&
                    faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="border-2 border-slate-200 px-4 mb-2 rounded duration-300"
                        >
                            <button
                                className="flex justify-between items-center w-full py-3.5 text-left duration-300"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className="font-medium md:text-lg">{faq.question}</span>
                                <span className="font-medium duration-300 md:text-xl text-lg">
                                    {openIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="py-2 text-gray-600 text-justify border-t-2 border-slate-200">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default About;
