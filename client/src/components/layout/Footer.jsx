import React from 'react';
import { FaArrowRight, FaFacebook } from "react-icons/fa";
import { FaTwitter, FaInstagram } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className='flex flex-col gap-2 bg-slate-200 py-4 w-auto'>
            <div className="main-top flex flex-col md:flex-row justify-between sm:gap-5 px-8 md:px-16">
                <div className="newsletter flex flex-col">
                    <h2 className='font-semibold text-lg mb-1'>Join our Newsletter</h2>
                    <span className='flex flex-col'>
                        <span>Drop your email below to get updates about us,</span>
                        <span>latest news, tips, and more!</span>
                    </span>

                    <div className='flex items-center py-2 md:pt-4 gap-2'>
                        <input type="email" aria-label="Email" className='outline-none border-2 border-white bg-white focus:border-blue-600 px-2 py-1 rounded-md font-medium' placeholder='Enter your email' />
                        <button aria-label="Submit" className="hover:cursor-pointer duration-200 border-2 border-white bg-white text-blue-700 hover:bg-blue-600 hover:text-slate-100 hover:border-blue-600 px-3 py-2 rounded-md font-medium">
                            <FaArrowRight />
                        </button>
                    </div>
                </div>

                <div className="product-links">
                    <h2 className='font-semibold text-lg mb-1'>Product Links</h2>
                    <ul>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Categories</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>New Arrival</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Features</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Collections</li>
                    </ul>
                </div>

                <div className="company-links">
                    <h2 className='font-semibold text-lg mb-1'>Company</h2>
                    <ul>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>About</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Blog</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Careers</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Contact</li>
                    </ul>
                </div>

                <div className="support-links">
                    <h2 className='font-semibold text-lg mb-1'>Support</h2>
                    <ul>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Support Center</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>FAQ</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Privacy Policy</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Terms of Service</li>
                    </ul>
                </div>

                <div className="social-icons">
                    <h2 className='font-semibold text-lg mb-2'>Get In Touch</h2>
                    <ul className='flex md:flex-col lg:flex-row items-center md:justify-around gap-3'>
                        <li className='text-2xl font-bold hover:text-blue-600 duration-200 cursor-pointer'><FaFacebook /></li>
                        <li className='text-2xl font-bold hover:text-blue-600 duration-200 cursor-pointer'><FaTwitter /></li>
                        <li className='text-2xl font-extrabold hover:text-blue-600 duration-200 cursor-pointer'><FaInstagram /></li>
                    </ul>
                </div>
            </div>

            <div className="w-full text-center text-sm mt-3">
                <span>&copy; 2024 ShopLynk. All Rights Reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;