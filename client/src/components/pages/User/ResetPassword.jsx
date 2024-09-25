import { useEffect, useState } from "react";
import resetPasswordImg from "../../assets/reset-password.jpg";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loadUser, resetPassword } from "../../redux/actions/UserAction";
import PageLoader from "../layout/Loaders/PageLoader";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(30, "Password cannot exceed 30 characters"),
        confirmPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(30, "Password cannot exceed 30 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const { loading, error, success } = useSelector(
        (state) => state.forgotPassword
    );

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevState) => !prevState);
    };

    const onSubmit = (data) => {
        dispatch(resetPassword(token, data));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (success) {
            dispatch(loadUser());
            navigate("/", {
                state: { toastMessage: "Password has been reset and logged in successfully!", type: "success" },
            });
        }
    }, [dispatch, error, success, navigate]);

    return loading ? (
        <PageLoader />
    ) : (
        <div className="reset-password-section w-full md:h-[70svh] lg:h-[90svh] px-8 md:px-16 flex lg:flex-row flex-col-reverse items-center justify-center lg:gap-8 mb-6 lg:mb-0">
            <TitleHelmet title={"Reset Password | ShopLynk"} />

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
                style={{ width: "350px" }}
            />

            <div className="reset-password-img lg:-ml-10 lg:-mt-8">
                <img
                    src={resetPasswordImg}
                    alt="Reset Password Image"
                    className="mix-blend-multiply md:block hidden"
                    width={580}
                />
            </div>

            <form
                className="reset-password-form w-fit md:w-96 lg:-mt-8 mt-0"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-blue-600">
                    Reset Password
                </h2>

                <div className="flex flex-col gap-4 border-2 border-slate-200 rounded p-4 bg-slate-200">
                    <div className="flex gap-1 flex-col relative">
                        <label htmlFor="password" className="font-medium text-lg pl-0.5">
                            Enter Password
                        </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                            {...register("password")}
                        />

                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 duration-200"
                        >
                            {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                        </button>

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
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
