import React, { useState } from "react";
import signUpImg from "../../assets/signup-img.jpg";
import { Link } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        avatar: "",
        role: "buyer",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/avatar.png");
    const [errors, setErrors] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevState) => !prevState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setFormData((prevData) => ({
                        ...prevData,
                        avatar: reader.result,
                    }));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = "Full Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        } else if (confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        return newErrors;
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleNext = () => {
        const formErrors = validateStep1();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateStep2();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            console.log(formData);
        }
    };

    return (
        <div className="signup-section w-full h-[75svh] lg:h-[90svh] px-8 md:px-16 flex lg:flex-row flex-col-reverse items-center justify-center gap-8 -mb-6 lg:mb-0">
            <TitleHelmet title={"Sign Up | ShopLynk"} />

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
                    src={signUpImg}
                    alt="SignUp Image"
                    className="mix-blend-multiply lg:block hidden"
                    width={580}
                />
            </div>

            <form
                className="signup-form w-fit md:w-96"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl md:text-4xl font-bold text-center mb-3 text-blue-600">
                    Sign Up
                </h2>

                <div className="flex flex-col gap-4 border-2 border-slate-200 rounded p-4 bg-slate-200 w-80 md:w-full">
                    {step === 1 && (
                        <>
                            <div className="flex gap-1 flex-col">
                                <label
                                    htmlFor="username"
                                    className="font-medium text-lg pl-0.5"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter Full Name"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    required
                                />
                                {errors.username && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.username}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-1 flex-col">
                                <label htmlFor="email" className="font-medium text-lg pl-0.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    required
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-1 flex-col">
                                <label htmlFor="avatar" className="font-medium text-lg pl-0.5">
                                    Avatar
                                </label>

                                <div className="flex gap-1.5 items-center">
                                    {avatarPreview && (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar Preview"
                                            className="-ml-1 w-16 h-16 object-cover rounded-full"
                                        />
                                    )}

                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                            >
                                Next
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="flex gap-1 flex-col relative">
                                <label
                                    htmlFor="password"
                                    className="font-medium text-lg pl-0.5"
                                >
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    required
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-11 cursor-pointer text-xl"
                                >
                                    {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                </span>
                                {errors.password && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.password}
                                    </span>
                                )}
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
                                    name="confirmPassword"
                                    placeholder="Enter Confirm Password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPassword}
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    required
                                />
                                <span
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-11 cursor-pointer text-xl"
                                >
                                    {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                </span>
                                {errors.confirmPassword && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.confirmPassword}
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between mt-1 px-1">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                                >
                                    Sign Up
                                </button>
                            </div>

                            <div className="text-center">
                                Want to become a Seller?
                                <Link
                                    to="/register"
                                    className="pl-1 font-semibold hover:text-blue-600"
                                >
                                    Register
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="text-center mt-4">
                    Already have an account?
                    <Link to="/login" className="pl-1 font-semibold hover:text-blue-600">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
