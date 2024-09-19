import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import avatarImg from "/avatar.png";
import ItemLoader from "../layout/ItemLoader";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearErrors } from "../../redux/actions/UserAction";

const PersonalInformation = ({ setActiveTab }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, user, isAuthenticated } = useSelector(
        (state) => state.user
    );
    const [authCheckLoading, setAuthCheckLoading] = useState(true);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (loading === false) {
            if (!isAuthenticated) {
                navigate("/login");
            } else {
                setAuthCheckLoading(false);
            }
        }
    }, [loading, error, isAuthenticated, navigate, dispatch]);

    return loading || authCheckLoading ? (
        <div className="bg-transparent lg:-mt-[3.4rem] lg:-ml-28 -ml-2">
            <ItemLoader />
        </div>
    ) : (
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-20 lg:pl-14">
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

            <div className="avatar">
                <img
                    src={user?.avatar?.url || avatarImg}
                    alt="Avatar"
                    className="md:w-[19rem] md:h-[19rem] aspect-square rounded-full object-cover hover:scale-105 duration-300 cursor-pointer"
                />
            </div>

            <div className="details flex flex-col gap-4 bg-white lg:p-6 p-4 rounded-lg shadow-md lg:w-[30%] w-[100%]">
                <div className="flex flex-col items-start">
                    <h2 className="text-blue-600 text-xl font-semibold">Full Name</h2>
                    <p className="font-medium text-lg">{user?.username || "User Name"}</p>
                </div>

                <div className="flex flex-col items-start">
                    <h2 className="text-blue-600 text-xl font-semibold">E-mail</h2>
                    <p className="font-medium text-lg">{user?.email || "User E-mail"}</p>
                </div>

                <div className="flex flex-col items-start">
                    <h2 className="text-blue-600 text-xl font-semibold">Joined At</h2>
                    <p className="font-medium">
                        {String(user?.createdAt).substring(0, 10) || "User Name"}
                    </p>
                </div>

                <button
                    className="rounded text-center bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    onClick={() => setActiveTab("updateProfile")}
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default PersonalInformation;
