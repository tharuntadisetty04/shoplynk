import React from "react"
import { FiShoppingCart } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";

const Navbar = () => {
    return (
        <header>
            <div className="flex justify-between items-center py-5 px-16">
                <div className="text-2xl font-semibold">
                    <a className="hover:text-blue-600 duration-200" href="">ShopLynk</a>
                </div>

                <div className="flex items-center justify-center gap-7 font-medium text-lg">
                    <a href="" className="hover:text-blue-600 duration-200">Home</a>
                    <a href="" className="hover:text-blue-600 duration-200">Products</a>
                    <a href="" className="hover:text-blue-600 duration-200">About</a>
                    <a href="" className="hover:text-blue-600 duration-200">Contact</a>
                </div>

                <div className="flex gap-3 items-center justify-between">
                    <button className="hover:text-blue-600 text-xl duration-200"><FiSearch /></button>
                    <button className="hover:text-blue-600 text-xl duration-200"><FiShoppingCart /></button>
                    <button className="hover:text-blue-600 text-xl duration-200 pl-1"><FaRegUser /></button>
                </div>
            </div>
        </header>
    )
}

export default Navbar