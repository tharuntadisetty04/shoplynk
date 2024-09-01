import React, { useState } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleForm = (e) => {
        e.preventDefault();

        const { name, email, phone, message } = formData;

        if (name && email && phone && message) {
            toast.success("Message Sent!");

            setFormData({
                name: "",
                email: "",
                phone: "",
                message: "",
            });
        } else {
            toast.error("Please fill in all the required fields.");
        }
    };

    return (
        <div className="contact w-full h-full py-4 px-8 md:px-16 mx-auto">
            <TitleHelmet title={"Contact | ShopLynk"} />

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
            />

            <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-center mb-6">
                <span>Contact</span>
                <span className="text-blue-600"> Us!</span>
            </h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Contact Info */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Call To Us</h2>
                    <p className="text-gray-600 mb-2">
                        We are available 24/7, 7 days a week.
                    </p>
                    <p className="text-gray-800 font-medium mb-4">
                        Phone: +91 12345 67890
                    </p>
                    <hr className="my-4" />
                    <h2 className="text-2xl font-semibold mb-4">Write To Us</h2>
                    <p className="text-gray-600 mb-2">
                        Fill out our form and we will contact you within 24 hours.
                    </p>
                    <p className="text-gray-800 font-medium">
                        E-mail: customer@exclusive.com
                    </p>
                    <p className="text-gray-800 font-medium">
                        E-mail: support@exclusive.com
                    </p>
                </div>

                {/* Contact Form */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleForm}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your Name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Your Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Your Email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Your Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Your Phone"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Your Message"
                                rows="4"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 ml-0.5"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
