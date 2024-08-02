import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "text-blue-600" : "hover:text-blue-600 duration-200";

    return (
        <header>
            <div className="flex justify-between items-center py-5 px-8 md:px-16 w-auto">
                <div className="text-2xl font-semibold">
                    <Link className="flex gap-[0.1rem]" to="/">
                        <span className="text-blue-600">Shop</span>
                        <span className="bg-blue-600 rounded-sm text-neutral-100 px-1">Lynk</span>
                    </Link>
                </div>

                <div className="hidden sm:block">
                    <div className="flex items-center justify-center gap-7 font-medium text-lg">
                        <Link to="/" className={isActive("/")}>Home</Link>
                        <Link to="/products" className={isActive("/products")}>Products</Link>
                        <Link to="/about" className={isActive("/about")}>About</Link>
                        <Link to="/contact" className={isActive("/contact")}>Contact</Link>
                    </div>
                </div>

                <div className="flex gap-3 items-center justify-between">
                    <button aria-label="Search" className="hover:text-blue-600 text-2xl duration-200"><IoIosSearch /></button>
                    <button aria-label="Cart" className="hover:text-blue-600 text-xl duration-200"><FiShoppingCart /></button>
                    <button aria-label="User" className="hover:text-blue-600 text-xl duration-200 pl-1.5"><FaRegUser /></button>
                    <button
                        aria-label="Menu"
                        className="sm:hidden hover:text-blue-600 text-2xl duration-200"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="sm:hidden flex flex-col items-center gap-3 py-4">
                    <Link to="/" className={isActive("/")}>Home</Link>
                    <Link to="/products" className={isActive("/products")}>Products</Link>
                    <Link to="/about" className={isActive("/about")}>About</Link>
                    <Link to="/contact" className={isActive("/contact")}>Contact</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
