import { useEffect } from "react";
import forgotPasswordImg from "../../assets/forgot-password.jpg";
import TitleHelmet from "../../utils/TitleHelmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
    clearErrors,
    clearMessage,
    forgotPassword,
} from "../../../redux/actions/UserAction";
import PageLoader from "../../layout/Loaders/PageLoader";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector(
        (state) => state.forgotPassword
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data) => {
        dispatch(forgotPassword(data.email));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (message.length) {
            toast.success(message, {
                onClose: () => dispatch(clearMessage()),
            });
        }
    }, [dispatch, error, message]);

    return loading ? (
        <PageLoader />
    ) : (
        <div className="forgot-password-section w-full md:h-[70svh] lg:h-[90svh] px-8 md:px-16 flex lg:flex-row flex-col-reverse items-center justify-center lg:gap-8 mb-6 lg:mb-0">
            <TitleHelmet title={"Forgot Password | ShopLynk"} />

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
                style={{ width: "360px" }}
            />

            <div className="forgot-password-img lg:-ml-10">
                <img
                    src={forgotPasswordImg}
                    alt="Forgot Password Image"
                    className="mix-blend-multiply md:block hidden"
                    width={580}
                />
            </div>

            <form
                className="forgot-password-form w-fit md:w-96 lg:-mt-8 mt-0"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-blue-600">
                    Forgot Password
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

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
