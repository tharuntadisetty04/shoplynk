import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import avatarImg from "/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/actions/UserAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaBagShopping } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";

const Header = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    // const cartItems = useSelector((state) => state.cart.cartItems);
    const cartItems = 2;
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path
            ? "text-blue-600"
            : "hover:text-blue-600 duration-200";

    const toggleProfileModal = () => {
        setProfileMenuOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (
            profileMenuRef.current &&
            !profileMenuRef.current.contains(event.target)
        ) {
            setProfileMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logout = () => {
        dispatch(logoutUser());
        toast.success("User logged out successfully!");
    };

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
    />;

    return (
        <header>
            <div className="flex justify-between items-center py-5 px-8 md:px-16 w-auto">
                {/* Logo or brand name */}
                <div className="text-2xl font-semibold">
                    <Link className="flex gap-[0.1rem]" to="/">
                        <span className="text-blue-600">Shop</span>
                        <span className="bg-blue-600 rounded-sm text-neutral-100 px-1">
                            Lynk
                        </span>
                    </Link>
                </div>

                {/* Navbar */}
                <div className="hidden md:block">
                    <div className="flex items-center justify-center gap-7 font-medium text-lg">
                        <Link to="/" className={isActive("/")}>
                            Home
                        </Link>
                        <Link to="/products" className={isActive("/products")}>
                            Products
                        </Link>
                        <Link to="/about" className={isActive("/about")}>
                            About
                        </Link>
                        <Link to="/contact" className={isActive("/contact")}>
                            Contact
                        </Link>
                    </div>
                </div>

                <div className="flex gap-x-2.5 items-center justify-between">
                    <Link
                        aria-label="Search"
                        to="/products/search"
                        className="hover:text-blue-600 text-2xl duration-200"
                    >
                        <IoIosSearch />
                    </Link>
                    <Link
                        aria-label="Cart"
                        to="/cart"
                        className="hover:text-blue-600 text-xl duration-200 relative"
                    >
                        <FiShoppingCart />
                        {cartItems > 0 && (
                            <span className="absolute bottom-[0.7rem] left-[0.7rem] bg-blue-600 text-neutral-100 rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                {cartItems}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div
                            className="relative border-2 border-slate-300 hover:border-blue-600 duration-200 rounded-full h-8 w-8 ml-1 cursor-pointer"
                            onClick={toggleProfileModal}
                            ref={profileMenuRef}
                        >
                            {isAuthenticated && user?.avatar?.url ? (
                                <img
                                    src={user.avatar.url}
                                    alt="Profile"
                                    width={50}
                                    className="rounded-full w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={avatarImg}
                                    alt="Default Avatar"
                                    width={50}
                                    className="rounded-full w-full h-full object-cover"
                                />
                            )}

                            {profileMenuOpen && (
                                <div className="absolute rounded shadow-md bg-neutral-100 border-2 border-slate-200 w-fit py-2 px-4 top-10 right-0 space-y-1">
                                    <Link
                                        to="/profile"
                                        className="font-medium hover:text-blue-600 duration-200 flex items-center justify-start gap-1.5"
                                    >
                                        <span className="text-sm">
                                            <FaUser />
                                        </span>
                                        <span>Profile</span>
                                    </Link>
                                    {user && user.role === "seller" && (
                                        <Link
                                            to="/admin/dashboard"
                                            className="font-medium hover:text-blue-600 duration-200 flex items-center justify-start gap-1.5"
                                        >
                                            <span className="text-sm">
                                                <MdDashboard />
                                            </span>
                                            <span>Dashboard</span>
                                        </Link>
                                    )}
                                    <Link
                                        to="/orders"
                                        className="font-medium hover:text-blue-600 duration-200 flex items-center justify-start gap-1.5"
                                    >
                                        <span className="text-sm">
                                            <FaBagShopping />
                                        </span>
                                        {user.role === "seller" ? (
                                            <span>My Orders</span>
                                        ) : (
                                            <span>Orders</span>
                                        )}
                                    </Link>
                                    <div
                                        className="font-medium hover:text-blue-600 duration-200 flex items-center justify-start gap-1.5"
                                        onClick={logout}
                                    >
                                        <span className="font-semibold text-[1.11rem] -mr-[0.12rem]">
                                            <IoLogOutOutline />
                                        </span>
                                        <span>Logout</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            aria-label="User"
                            to="/login"
                            className="hover:text-blue-600 text-xl duration-200 pl-1"
                        >
                            <FaRegUser />
                        </Link>
                    )}

                    <button
                        aria-label="Menu"
                        className="md:hidden hover:text-blue-600 text-2xl duration-200"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* ham-burger menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col items-center gap-3 font-medium py-4 bg-slate-200 mb-2">
                    <Link to="/" className={isActive("/")}>
                        Home
                    </Link>
                    <Link to="/products" className={isActive("/products")}>
                        Products
                    </Link>
                    <Link to="/about" className={isActive("/about")}>
                        About
                    </Link>
                    <Link to="/contact" className={isActive("/contact")}>
                        Contact
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
