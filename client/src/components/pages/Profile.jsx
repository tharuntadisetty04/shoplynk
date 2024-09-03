import React, { useState, useEffect } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../layout/PageLoader";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, logoutUser } from "../../redux/actions/UserAction";
import { IoLogOutOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaBagShopping, FaUser } from "react-icons/fa6";
import { AiFillShop } from "react-icons/ai";
import { IoMdLock } from "react-icons/io";
import PersonalInformation from "./PersonalInformation";
import UpdatePassword from "./UpdatePassword";
import UpdateRole from "./UpdateRole";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, user, isAuthenticated } = useSelector(
        (state) => state.user
    );
    const [activeTab, setActiveTab] = useState("personalInformation");
    const [authCheckLoading, setAuthCheckLoading] = useState(true);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (loading === false) {
            if (!isAuthenticated) {
                navigate("/login");
            } else {
                setAuthCheckLoading(false);
            }
        }
    }, [loading, error, isAuthenticated, navigate]);

    const logout = () => {
        dispatch(logoutUser());
        navigate("/", {
            state: { toastMessage: "User logged out successfully!" },
        });
    };

    return loading || authCheckLoading ? (
        <PageLoader />
    ) : (
        <div className="profile w-full h-full py-4 px-8 md:px-16 min-h-[26.5rem]">
            <TitleHelmet title={`${user?.username || "User"}'s Profile | ShopLynk`} />

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

            <div className="mx-auto flex lg:flex-row flex-col justify-between lg:items-start items-center gap-4">
                <div className="side-bar lg:w-[15rem] lg:flex lg:flex-col lg:justify-between w-full grid grid-cols-2 gap-4">
                    <div
                        className={`rounded-md border-2 border-slate-200 font-medium py-2 px-3 flex items-center gap-1.5 hover:bg-blue-600 hover:text-neutral-100 duration-200 cursor-pointer ${activeTab === "personalInformation"
                            ? "bg-blue-600 text-neutral-100"
                            : ""
                            }`}
                        onClick={() => setActiveTab("personalInformation")}
                    >
                        <span className="text-base">
                            <FaUser />
                        </span>
                        <p className="text-base lg:text-lg">Personal Information</p>
                    </div>

                    <Link
                        to="/orders"
                        className="text-start rounded-md border-2 border-slate-200 text-lg font-medium py-2 px-3 hover:bg-blue-600 hover:text-neutral-100 duration-200 flex items-center gap-1.5"
                    >
                        <span className="text-base">
                            <FaBagShopping />
                        </span>
                        <span className="text-base lg:text-lg">My Orders</span>
                    </Link>

                    {user && user.role === "seller" && (
                        <Link
                            to="/admin/dashboard"
                            className="text-start rounded-md border-2 border-slate-200 text-lg font-medium py-2 px-3 hover:bg-blue-600 hover:text-neutral-100 duration-200 flex items-center gap-1.5"
                        >
                            <span className="text-lg">
                                <MdDashboard />
                            </span>
                            <p className="text-base lg:text-lg w-full">Admin Dashboard</p>
                        </Link>
                    )}

                    <div
                        className={`rounded-md border-2 border-slate-200 font-medium py-2 px-3 flex items-center gap-1.5 hover:bg-blue-600 hover:text-neutral-100 duration-200 cursor-pointer ${activeTab === "updatePassword"
                            ? "bg-blue-600 text-neutral-100"
                            : ""
                            }`}
                        onClick={() => setActiveTab("updatePassword")}
                    >
                        <span className="text-xl">
                            <IoMdLock />
                        </span>
                        <span className="text-base lg:text-lg">Update Password</span>
                    </div>

                    {user && user.role === "buyer" && (
                        <div
                            className={`rounded-md border-2 border-slate-200 font-medium py-2 px-3 flex items-center gap-1.5 hover:bg-blue-600 hover:text-neutral-100 duration-200 cursor-pointer ${activeTab === "updateRole" ? "bg-blue-600 text-neutral-100" : ""
                                }`}
                            onClick={() => setActiveTab("updateRole")}
                        >
                            <span className="text-xl">
                                <AiFillShop />
                            </span>
                            <span className="text-base lg:text-lg">Become a Seller</span>
                        </div>
                    )}

                    {window.innerWidth > 1000 && (
                        <button
                            className="text-start rounded-md border-2 border-slate-200 text-lg font-medium py-2 px-3 hover:bg-blue-600 hover:text-neutral-100 duration-200 flex items-center gap-1.5"
                            onClick={logout}
                        >
                            <span className="text-[1.3rem] ml-0.5">
                                <IoLogOutOutline />
                            </span>
                            <span>Logout</span>
                        </button>
                    )}
                </div>

                <div className="content w-4/5">
                    {activeTab === "personalInformation" && <PersonalInformation />}
                    {activeTab === "updatePassword" && <UpdatePassword />}
                    {activeTab === "updateRole" && <UpdateRole />}
                </div>
            </div>
        </div>
    );
};

export default Profile;
