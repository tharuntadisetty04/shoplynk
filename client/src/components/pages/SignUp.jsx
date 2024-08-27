import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import signUpImg from "../../assets/signup-img.jpg";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import TitleHelmet from "../utils/TitleHelmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/actions/UserAction";

const signUpSchema = z
    .object({
        username: z
            .string()
            .min(3, "Full Name should at least have 3 characters")
            .max(30, "Full Name cannot exceed 30 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(30, "Password cannot exceed 30 characters"),
        confirmPassword: z.string(),
        role: z.enum(["buyer", "seller"], "Role is required"),
        avatar: z.any().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated, user } = useSelector(
        (state) => state.user
    );

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("/avatar.png");

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
    } = useForm({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "buyer",
            avatar: "",
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevState) => !prevState);
    };

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

    const handleNext = async () => {
        const isValid = await trigger(["username", "email"]);
        if (isValid) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const onSubmit = (data) => {
        dispatch(registerUser(data));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isAuthenticated) {
            navigate("/");
        }
    }, [dispatch, error, isAuthenticated, navigate]);

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
                onSubmit={handleSubmit(onSubmit)}
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
                                    {...register("username", {
                                        required: "Full Name is required",
                                    })}
                                    placeholder="Enter Full Name"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
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
                                    {...register("email", { required: "Email is required" })}
                                    placeholder="Enter Email"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.email.message}
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
                            <div className="flex flex-col">
                                <div className="flex w-full items-center gap-3 -mb-1.5">
                                    <p className="font-medium text-[1.15rem] pl-0.5">Role:</p>

                                    <div className="flex gap-1">
                                        <input
                                            type="radio"
                                            name="role"
                                            id="buyer"
                                            value="buyer"
                                            {...register("role", { required: "Role is required" })}
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="buyer" className="font-medium">
                                            Buyer
                                        </label>
                                    </div>
                                    <div className="flex gap-1">
                                        <input
                                            type="radio"
                                            name="role"
                                            id="seller"
                                            value="seller"
                                            {...register("role", { required: "Role is required" })}
                                        />
                                        <label htmlFor="seller" className="font-medium">
                                            Seller
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    {errors.role && (
                                        <span className="text-red-500 text-sm font-medium pl-1">
                                            {errors.role.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-1 flex-col relative">
                                <label
                                    htmlFor="password"
                                    className="font-medium text-lg pl-0.5"
                                >
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    placeholder="Enter Password"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-11 cursor-pointer text-xl"
                                >
                                    {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                </span>
                                {errors.password && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.password.message}
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
                                    {...register("confirmPassword")}
                                    placeholder="Confirm Password"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                />
                                <span
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-11 cursor-pointer text-xl"
                                >
                                    {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                </span>
                                {errors.confirmPassword && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.confirmPassword.message}
                                    </span>
                                )}
                            </div>

                            <div className="w-full flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="rounded bg-slate-500 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 duration-200"
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
                        </>
                    )}
                </div>

                <div className="text-center text-slate-700 mt-2">
                    Already have an account?
                    <Link
                        to="/login"
                        className="pl-1 font-medium text-blue-600 hover:text-blue-500 hover:underline duration-200"
                    >
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
