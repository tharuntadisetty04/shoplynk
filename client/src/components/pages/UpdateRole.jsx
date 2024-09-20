import React, { useEffect } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updateUserRole } from "../../redux/actions/UserAction";
import ItemLoader from "../layout/ItemLoader";
import shopImg from "../../assets/register-seller.jpg";
import { useNavigate } from "react-router-dom";

const UpdateRoleSchema = z.object({
    username: z
        .string()
        .min(3, "Full Name should at least have 3 characters")
        .max(30, "Full Name cannot exceed 30 characters"),
    email: z.string().email("Invalid email address"),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept terms and conditions",
    }),
});

const UpdateRole = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user, isAuthenticated } = useSelector(
        (state) => state.user
    );

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(UpdateRoleSchema),
    });

    useEffect(() => {
        if (user) {
            setValue("username", user.username || "");
            setValue("email", user.email || "");
            setValue("termsAccepted", false);
        }
    }, [user, setValue]);

    const onSubmit = (data) => {
        dispatch(updateUserRole(data));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (isAuthenticated && user.role === "seller") {
            navigate("/", {
                state: { toastMessage: "User role updated successfully!", type: "success" },
            });
        }
    }, [dispatch, error, navigate, user, isAuthenticated]);

    return loading ? (
        <div className="bg-transparent lg:-mt-[3.4rem] lg:-ml-28 -ml-2">
            <ItemLoader />
        </div>
    ) : (
        <div className="update-role w-full h-full flex lg:flex-row flex-col items-center justify-center lg:gap-16 lg:-mt-3">
            <TitleHelmet title={"Update Role | ShopLynk"} />

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

            <div className="lg:-ml-44 md:block hidden lg:-mt-6">
                <img
                    src={shopImg}
                    alt="Shop Image"
                    width={400}
                    className="mix-blend-multiply"
                />
            </div>

            <form
                className="update-seller-form w-fit md:w-full lg:w-80 shadow-md rounded lg:-mt-2"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-4 border-2 border-slate-200 rounded p-4 bg-slate-200">
                    <div className="flex gap-1 flex-col">
                        <label htmlFor="username" className="font-medium text-lg pl-0.5">
                            Business Name
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

                    <div className="flex flex-col gap-1">
                        <div className="flex gap-1.5 pl-1">
                            <input
                                type="checkbox"
                                {...register("termsAccepted")}
                                className="cursor-pointer"
                            />
                            <label htmlFor="termsAccepted" className="font-medium text-sm">
                                I Agree to the Terms & Conditions.
                            </label>
                        </div>
                        {errors.termsAccepted && (
                            <span className="text-red-500 text-sm font-medium pl-1">
                                {errors.termsAccepted.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        Register as Seller
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateRole;
