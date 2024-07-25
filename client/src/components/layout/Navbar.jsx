import React, { useState } from "react";
import { FiShoppingCart, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header>
            <div className="flex justify-between items-center py-5 px-8 md:px-16 w-auto">
                <div className="text-2xl font-semibold">
                    <Link className="hover:text-blue-600 duration-200" to="/">ShopLynk</Link>
                </div>

                <div className="hidden sm:block">
                    <div className="flex items-center justify-center gap-7 font-medium text-lg">
                        <Link to="/" className="hover:text-blue-600 duration-200">Home</Link>
                        <Link to="/products" className="hover:text-blue-600 duration-200">Products</Link>
                        <Link to="/about" className="hover:text-blue-600 duration-200">About</Link>
                        <Link to="/contact" className="hover:text-blue-600 duration-200">Contact</Link>
                    </div>
                </div>

                <div className="flex gap-3 items-center justify-between">
                    <button aria-label="Search" className="hover:text-blue-600 text-xl duration-200"><FiSearch /></button>
                    <button aria-label="Cart" className="hover:text-blue-600 text-xl duration-200"><FiShoppingCart /></button>
                    <button aria-label="User" className="hover:text-blue-600 text-xl duration-200 pl-1"><FaRegUser /></button>
                    <button
                        aria-label="Menu"
                        className="sm:hidden hover:text-blue-600 text-xl duration-200"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="sm:hidden flex flex-col items-center gap-3 py-4">
                    <Link to="/" className="hover:text-blue-600 duration-200">Home</Link>
                    <Link to="/products" className="hover:text-blue-600 duration-200">Products</Link>
                    <Link to="/about" className="hover:text-blue-600 duration-200">About</Link>
                    <Link to="/contact" className="hover:text-blue-600 duration-200">Contact</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;