import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className='flex flex-col gap-2 bg-slate-100 p-4'>
            <div className="main-top flex justify-between px-16">
                <div className="newsletter flex flex-col">
                    <h2 className='font-semibold text-lg mb-1'>Join our Newsletter</h2>
                    <span>
                        Drop your email below to get update about us, <br />
                        lastest news, tips, and more!
                    </span>

                    <div className='flex items-center pt-4 gap-2'>
                        <input type="text" className='outline-none border-2 border-white bg-white focus:border-2 focus:border-blue-600 px-2 py-1 rounded-md font-mediusm' placeholder='Enter your email' />
                        <button className="hover:cursor-pointer duration-200 border-2 border-white bg-white text-blue-700 hover:bg-blue-600 hover:text-slate-100 hover:border-2 hover:border-blue-600 px-3 py-2 rounded-md font-medium"><FaArrowRight /></button>
                    </div>
                </div>

                <div className="links1">
                    <h2 className='font-semibold text-lg mb-1'>Product Links</h2>
                    <ul>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Categories</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>New Arrival</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Features</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Collections</li>
                    </ul>
                </div>

                <div className="links2">
                    <h2 className='font-semibold text-lg mb-1'>Company</h2>
                    <ul>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>About</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Blog</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Careers</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Contact</li>
                    </ul>
                </div>

                <div className="links3">
                    <h2 className='font-semibold text-lg mb-1'>Support</h2>
                    <ul>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Support Center</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>FAQ</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Privacy Policy</li>
                        <li className='hover:text-blue-600 duration-200 cursor-pointer'>Terms of service</li>
                    </ul>
                </div>

                <div className="social-icons">
                    <h2 className='font-semibold text-lg mb-1'>Get In Touch</h2>
                    <ul className='flex items-center gap-3'>
                        <li className='text-3xl font-bold hover:text-blue-600 duration-200 cursor-pointer'><TiSocialFacebookCircular /></li>
                        <li className='text-2xl font-bold hover:text-blue-600 duration-200 cursor-pointer'><FaSquareXTwitter /></li>
                        <li className='text-2xl font-extrabold hover:text-blue-600 duration-200 cursor-pointer'><FaInstagram /></li>
                    </ul>
                </div>
            </div>

            <div className="w-full text-center text-sm mt-5">
                <span>Copyright &copy;2024 ShopLynk. All Right Reseved</span>
            </div>
        </footer>
    )
}

export default Footer