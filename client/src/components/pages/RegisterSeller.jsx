import React, { useState } from "react";
import registerSeller from "../../assets/register-seller.jpg";
import { Link } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const RegisterSeller = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevState) => !prevState);
    };

    return (
        <div className="signup-section w-full h-full lg:h-[90svh] px-8 md:px-16 flex lg:flex-row flex-col-reverse items-center justify-evenly mb-6 lg:mb-0">
            <div className="login-img">
                <img
                    src={registerSeller}
                    alt="SignUp Image"
                    className="mix-blend-multiply lg:block hidden"
                    width={580}
                />
            </div>

            <div className="signup-form w-fit md:w-96">
                <h2 className="text-2xl md:text-4xl font-bold text-center mb-3 text-blue-600">
                    Register Seller
                </h2>

                <div className="flex flex-col gap-4 border-2 border-slate-200 rounded p-4 bg-slate-200">
                    <div className="flex gap-1 flex-col">
                        <label htmlFor="username" className="font-medium text-lg pl-0.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Full Name or Business Name"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            required
                        />
                    </div>

                    <div className="flex gap-1 flex-col">
                        <label htmlFor="email" className="font-medium text-lg pl-0.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            required
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
                            required
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-11 cursor-pointer text-xl"
                        >
                            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                        </span>
                    </div>

                    <div className="flex gap-1 flex-col relative">
                        <label
                            htmlFor="confirm-password"
                            className="font-medium text-lg pl-0.5"
                        >
                            Confirm Password
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Enter Confirm Password"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            required
                        />
                        <span
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-11 cursor-pointer text-xl"
                        >
                            {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                        </span>
                    </div>

                    <div className="pl-1 flex gap-2 items-center">
                        <input type="checkbox" id="seller" checked={true} />
                        <label htmlFor="seller" className="font-medium">
                            Register me as a Seller
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        Register
                    </button>

                    <div className="text-center">
                        Already have an account?
                        <Link
                            to="/login"
                            className="pl-1 font-semibold hover:text-blue-600"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterSeller;
