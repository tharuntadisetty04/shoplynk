import React, { useEffect, useState } from "react";
import loginImg from "../../assets/login-img.jpg";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginUser } from "../../redux/actions/UserAction";
import PageLoader from "../layout/PageLoader";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(30, "Password cannot exceed 30 characters"),
});

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(
        (state) => state.user
    );

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const onSubmit = (data) => {
        dispatch(loginUser(data.email, data.password));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isAuthenticated) {
            navigate("/", {
                state: { toastMessage: "User logged in successfully!" },
            });
        }
    }, [dispatch, error, isAuthenticated, navigate]);

    return !loading ? (
        <div className="login-section w-full h-[75svh] lg:h-[90svh] px-8 md:px-16 flex lg:flex-row flex-col-reverse items-center justify-center gap-8 -mb-6 lg:mb-0">
            <TitleHelmet title={"Login | ShopLynk"} />

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
            />

            <div className="login-img -ml-10">
                <img
                    src={loginImg}
                    alt="Login Image"
                    className="mix-blend-multiply lg:block hidden"
                    width={580}
                />
            </div>

            <form
                className="login-form w-fit md:w-96 lg:-mt-8 mt-0"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-2xl md:text-4xl font-bold text-center mb-3 text-blue-600">
                    Login
                </h2>

                <div className="flex flex-col gap-4 border-2 border-slate-200 rounded p-4 bg-slate-200">
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
                            <p className="text-red-500 text-sm font-medium pl-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-1 flex-col relative">
                        <label htmlFor="password" className="font-medium text-lg pl-0.5">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm font-medium pl-1">
                                {errors.password.message}
                            </p>
                        )}
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-11 cursor-pointer text-xl"
                        >
                            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                        </span>
                    </div>

                    <span className="font-medium text-end">
                        <Link
                            to="/forgot-password"
                            className="inline-block hover:text-blue-600"
                        >
                            Forgot Password?
                        </Link>
                    </span>

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        Login
                    </button>
                </div>

                <div className="text-center text-slate-700 mt-2">
                    Don't have an account?
                    <Link
                        to="/signup"
                        className="pl-1 font-medium text-blue-600 hover:text-blue-500 hover:underline duration-200"
                    >
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    ) : (
        <PageLoader />
    );
};

export default Login;
