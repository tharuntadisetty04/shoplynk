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
    updateUserProfile,
} from "../../redux/actions/UserAction";
import { useNavigate } from "react-router-dom";
import { UPDATE_PROFILE_RESET } from "../../redux/constants/UserConstant";
import ItemLoader from "../layout/ItemLoader";

const UpdateProfileSchema = z.object({
    username: z
        .string()
        .min(3, "Full Name should at least have 3 characters")
        .max(30, "Full Name cannot exceed 30 characters"),
    email: z.string().email("Invalid email address"),
    avatar: z.any().optional(),
});

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);
    const { loading, error, isUpdated } = useSelector(
        (state) => state.userProfile
    );

    const [avatarPreview, setAvatarPreview] = useState("/avatar.png");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(UpdateProfileSchema),
    });

    useEffect(() => {
        if (user) {
            setValue("username", user.username || "");
            setValue("email", user.email || "");
            setAvatarPreview(user.avatar?.url || "/avatar.png");
        }
    }, [user, setValue]);

    const handleInputChange = (e) => {
        const { name, files } = e.target;

        if (name === "avatar" && files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setValue("avatar", files[0]);
                }
            };
            reader.onerror = () => {
                toast.error("There was an error reading the file.");
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const onSubmit = (data) => {
        if (!data.avatar) {
            toast.error("Please upload an avatar.");
            return;
        }
        dispatch(updateUserProfile(data));
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
                state: { toastMessage: "Profile updated successfully!" },
            });

            dispatch({ type: UPDATE_PROFILE_RESET });
        }
    }, [dispatch, error, isUpdated, navigate]);

    return loading ? (
        <div className="bg-transparent -mt-[3.4rem] -ml-28">
            <ItemLoader />
        </div>
    ) : (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-20 lg:pl-14">
            <TitleHelmet title={"Update Profile | ShopLynk"} />

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
                    src={avatarPreview}
                    alt="Avatar"
                    className="md:w-[19rem] md:h-[19rem] aspect-square rounded-full object-cover hover:scale-105 duration-300 cursor-pointer"
                />
            </div>

            <form
                className="update-profile-form lg:w-80 w-full shadow-md rounded"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-4 border-2 border-slate-200 rounded p-4 bg-slate-200">
                    <div className="flex gap-1 flex-col">
                        <label htmlFor="username" className="font-medium text-lg pl-0.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Full Name or Business Name"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            {...register("username")}
                        />
                        {errors.username && (
                            <span className="text-red-500 text-sm font-medium pl-1">
                                {errors.username.message}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-1 flex-col">
                        <label htmlFor="email" className="font-medium text-lg pl-0.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            {...register("email")}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm font-medium pl-1">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-1 md:flex-col flex-row items-center md:items-start">
                        <label htmlFor="avatar" className="font-medium text-lg pl-0.5">
                            Avatar
                        </label>

                        <div className="lg:ml-[0.25rem] md:ml-28">
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfile;
