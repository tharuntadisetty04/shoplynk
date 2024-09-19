import React, { useEffect, useState } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
    clearErrors,
    loadUser,
    updateUserPassword,
} from "../../redux/actions/UserAction";
import { useNavigate } from "react-router-dom";
import { UPDATE_PASSWORD_RESET } from "../../redux/constants/UserConstant";
import ItemLoader from "../layout/ItemLoader";
import updatePasswordImg from "../../assets/update-password.jpg";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const UpdatePasswordSchema = z
    .object({
        oldpassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(30, "Password cannot exceed 30 characters"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(30, "Password cannot exceed 30 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isUpdated } = useSelector(
        (state) => state.userProfile
    );
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(UpdatePasswordSchema),
    });

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prevState) => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevState) => !prevState);
    };

    const onSubmit = (data) => {
        dispatch(updateUserPassword(data.oldpassword, data.newPassword));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (isUpdated) {
            dispatch(loadUser());
            navigate("/", {
                state: { toastMessage: "Password updated successfully!" },
            });

            dispatch({ type: UPDATE_PASSWORD_RESET });
        }
    }, [dispatch, error, isUpdated, navigate]);

    return loading ? (
        <div className="bg-transparent lg:-mt-[3.4rem] lg:-ml-28 -ml-2">
            <ItemLoader />
        </div>
    ) : (
        <div className="update-password w-full lg:h-96 flex lg:flex-row flex-col items-center justify-center lg:gap-16 lg:-mt-3 lg:-ml-4">
            <TitleHelmet title={"Update Password | ShopLynk"} />

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

            <div className="lg:-ml-44 md:block hidden">
                <img
                    src={updatePasswordImg}
                    alt="Update Password Image"
                    width={450}
                    className="mix-blend-multiply"
                />
            </div>

            <form
                className="update-password-form lg:w-[22rem] w-full shadow-md rounded mt-4 md:mt-0"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-4 border-2 border-slate-200 rounded p-4 bg-slate-200">
                    <div className="flex gap-1 flex-col">
                        <label htmlFor="oldpassword" className="font-medium text-lg pl-0.5">
                            Old Password
                        </label>
                        <input
                            type="text"
                            placeholder="Enter old password"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            {...register("oldpassword")}
                        />
                        {errors.oldpassword && (
                            <span className="text-red-500 text-sm font-medium pl-1">
                                {errors.oldpassword.message}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-1 flex-col relative">
                        <label htmlFor="newPassword" className="font-medium text-lg pl-0.5">
                            New Password
                        </label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            {...register("newPassword")}
                        />
                        <button
                            type="button"
                            onClick={toggleNewPasswordVisibility}
                            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 duration-200"
                        >
                            {showNewPassword ? (
                                <IoMdEyeOff size={20} />
                            ) : (
                                <IoMdEye size={20} />
                            )}
                        </button>
                        {errors.newPassword && (
                            <span className="text-red-500 text-sm font-medium pl-1">
                                {errors.newPassword.message}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-1 flex-col relative">
                        <label
                            htmlFor="confirmPassword"
                            className="font-medium text-lg pl-0.5"
                        >
                            Confirm Password
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Enter confirm password"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            {...register("confirmPassword")}
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 duration-200"
                        >
                            {showConfirmPassword ? (
                                <IoMdEyeOff size={20} />
                            ) : (
                                <IoMdEye size={20} />
                            )}
                        </button>
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-sm font-medium pl-1">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePassword;
