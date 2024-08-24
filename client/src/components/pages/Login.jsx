import React, { useState } from "react";
import loginImg from "../../assets/login-img.jpg";
import { Link } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleLoginForm = (e) => {
        e.preventDefault();
    };

    return (
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
                onSubmit={handleLoginForm}
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
                            required={true}
                        />
                    </div>

                    <div className="flex gap-1 flex-col relative">
                        <label htmlFor="password" className="font-medium text-lg pl-0.5">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            required={true}
                        />
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

                    <div className="text-center">
                        Don't have an account?
                        <Link
                            to="/signup"
                            className="pl-1 font-semibold hover:text-blue-600"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
