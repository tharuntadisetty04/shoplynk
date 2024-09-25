import { useState, useEffect } from "react";
import TitleHelmet from "../../utils/TitleHelmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    clearErrors,
    deleteUser,
    logoutUser,
} from "../../../redux/actions/UserAction";
import { MdDashboard, MdDeleteOutline } from "react-icons/md";
import { FaBagShopping, FaUser } from "react-icons/fa6";
import { AiFillShop } from "react-icons/ai";
import { IoMdLock } from "react-icons/io";
import PersonalInformation from "./PersonalInformation";
import UpdatePassword from "./UpdatePassword";
import UpdateRole from "./UpdateRole";
import UpdateProfile from "./UpdateProfile";
import { DELETE_ACCOUNT_RESET } from "../../../redux/constants/UserConstant";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { error, user } = useSelector((state) => state.user);
    const {
        loading: deleteLoading,
        error: deleteError,
        isDeleted,
    } = useSelector((state) => state.deleteUser);

    const [activeTab, setActiveTab] = useState("personalInformation");

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (deleteError) {
            toast.error(deleteError, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (isDeleted) {
            dispatch({ type: DELETE_ACCOUNT_RESET });
        }
    }, [error, deleteError, isDeleted, dispatch]);

    const deleteUserHandler = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            dispatch(deleteUser());

            navigate("/", {
                state: {
                    toastMessage: "Account deleted successfully!",
                    type: "success",
                },
            });

            setTimeout(() => {
                dispatch(logoutUser());
            }, 500);
        }
    };

    return (
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
                        className={`rounded-md border-2 border-slate-200 font-medium py-2 px-3 flex items-center gap-1.5 hover:bg-blue-600 hover:text-neutral-100 duration-200 cursor-pointer ${activeTab === "personalInformation" &&
                            "bg-blue-600 text-neutral-100"
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
                        className={`rounded-md border-2 border-slate-200 font-medium py-2 px-3 flex items-center gap-1.5 hover:bg-blue-600 hover:text-neutral-100 duration-200 cursor-pointer ${activeTab === "updatePassword" && "bg-blue-600 text-neutral-100"
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
                            className={`rounded-md border-2 border-slate-200 font-medium py-2 px-3 flex items-center gap-1.5 hover:bg-blue-600 hover:text-neutral-100 duration-200 cursor-pointer ${activeTab === "updateRole" && "bg-blue-600 text-neutral-100"
                                }`}
                            onClick={() => setActiveTab("updateRole")}
                        >
                            <span className="text-xl">
                                <AiFillShop />
                            </span>
                            <span className="text-base lg:text-lg">Become a Seller</span>
                        </div>
                    )}

                    <button
                        className="text-start rounded-md border-2 border-slate-200 text-lg font-medium py-2 px-3 hover:bg-blue-600 hover:text-neutral-100 duration-200 flex items-center gap-1.5"
                        onClick={deleteUserHandler}
                        disabled={deleteLoading}
                    >
                        <span className="text-[1.3rem] ml-0.5">
                            <MdDeleteOutline />
                        </span>
                        <span>Delete Account</span>
                    </button>
                </div>

                <div className="content md:w-4/5">
                    {activeTab === "personalInformation" && (
                        <PersonalInformation setActiveTab={setActiveTab} />
                    )}
                    {activeTab === "updatePassword" && <UpdatePassword />}
                    {activeTab === "updateRole" && <UpdateRole />}
                    {activeTab === "updateProfile" && <UpdateProfile />}
                </div>
            </div>
        </div>
    );
};

export default Profile;
