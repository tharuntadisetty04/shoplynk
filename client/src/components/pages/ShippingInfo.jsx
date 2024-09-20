import React, { useEffect, useState } from "react";
import TitleHelmet from "../utils/TitleHelmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Country, State } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveShippingInfo } from "../../redux/actions/cartAction";
import ProgressBar from "../utils/ProgressBar";
import { useNavigate } from "react-router-dom";
import shippingImg from "../../assets/shipping.jpg";

const shippingInfoSchema = z.object({
    address: z.string().min(1, "Please Enter Address"),
    city: z.string().min(1, "Please Enter City"),
    state: z.string().min(1, "Please Select State"),
    country: z.string().min(1, "Please Select Country"),
    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
    phoneNo: z.string().regex(/^\d{10}$/, "Invalid Phone number"),
});

const ShippingInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { shippingInfo } = useSelector((state) => state.cart);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [selectedCountry, setSelectedCountry] = useState(
        shippingInfo?.country || ""
    );

    const [selectedState, setSelectedState] = useState(shippingInfo?.state || "");
    const [currentStep, setCurrentStep] = useState(1);
    const [subStep, setSubStep] = useState(1);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(shippingInfoSchema),
        defaultValues: {
            address: shippingInfo?.address || "",
            city: shippingInfo?.city || "",
            state: shippingInfo?.state || "",
            country: shippingInfo?.country || "",
            pincode: shippingInfo?.pincode || "",
            phoneNo: shippingInfo?.phoneNo || "",
        },
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/shipping");
        } else {
            navigate("/login?redirect=shipping");
        }
    }, [isAuthenticated, navigate]);

    const nextHandler = (e) => {
        e.preventDefault();
        setSubStep(subStep + 1);
    };

    const backHandler = (e) => {
        e.preventDefault();
        setSubStep(subStep - 1);
    };

    const onSubmit = (data) => {
        dispatch(saveShippingInfo(data));
        setCurrentStep(currentStep + 1);

        if (isAuthenticated) {
            navigate("/order/confirm", {
                state: { toastMessage: "Shipping info saved!" },
            });
        } else {
            navigate("/login?redirect=shipping");
        }
    };

    return (
        <div className="shipping-page w-full h-full lg:min-h-[60svh] md:min-h-[65svh] px-8 md:px-16 pb-2">
            <TitleHelmet title={"Shipping Info | ShopLynk"} />

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

            <ProgressBar currentStep={currentStep} />

            <h2 className="text-2xl md:text-3xl font-bold text-center">
                {subStep === 2 ? (
                    <p>
                        Shipping <span className="text-blue-600">Info</span>
                    </p>
                ) : (
                    <p>
                        Customer <span className="text-blue-600">Details</span>
                    </p>
                )}
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-28 lg:-ml-12 md:gap-4 w-full">
                <img
                    src={shippingImg}
                    alt="Shipping Image"
                    width={window.innerWidth < 800 ? 600 : 700}
                    className="mix-blend-multiply md:block hidden"
                />

                <form
                    className="bg-slate-200 rounded shadow-sm px-6 py-4 my-4 space-y-2 w-96"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {subStep === 1 && (
                        <>
                            <div className="flex gap-1 flex-col pb-2">
                                <label htmlFor="phoneNo" className="font-medium text-lg">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={user?.username || ""}
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    placeholder="Enter Phone Number"
                                    readOnly
                                />
                            </div>

                            <div className="flex gap-1 flex-col pb-2">
                                <label htmlFor="phoneNo" className="font-medium text-lg">
                                    Email
                                </label>

                                <input
                                    type="text"
                                    value={user?.email || ""}
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    placeholder="Enter Phone Number"
                                    readOnly
                                />
                            </div>

                            <div className="flex gap-1 flex-col pb-2">
                                <label htmlFor="phoneNo" className="font-medium text-lg">
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    id="phoneNo"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    placeholder="Enter Phone Number"
                                    {...register("phoneNo")}
                                />

                                {errors.phoneNo && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.phoneNo.message}
                                    </span>
                                )}
                            </div>
                            <div className="flex w-full justify-end">
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 font-medium text-neutral-100 py-2 px-4 rounded duration-200 items-end"
                                    onClick={nextHandler}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {subStep === 2 && (
                        <>
                            <div className="flex gap-1 flex-col">
                                <label htmlFor="address" className="font-medium text-lg">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    id="address"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    placeholder="Enter address"
                                    {...register("address")}
                                />

                                {errors.address && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.address.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-1 flex-col">
                                <label htmlFor="city" className="font-medium text-lg">
                                    City
                                </label>

                                <input
                                    type="text"
                                    id="city"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    placeholder="Enter City"
                                    {...register("city")}
                                />

                                {errors.city && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.city.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-1 flex-col">
                                <label htmlFor="country" className="font-medium text-lg">
                                    Country
                                </label>

                                <select
                                    name="country"
                                    id="country"
                                    value={selectedCountry}
                                    {...register("country")}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                >
                                    <option value="" disabled>
                                        -- Select Country --
                                    </option>
                                    {Country &&
                                        Country.getAllCountries().map((ct) => (
                                            <option key={ct.isoCode} value={ct.isoCode}>
                                                {ct.name}
                                            </option>
                                        ))}
                                </select>

                                {errors.country && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.country.message}
                                    </span>
                                )}
                            </div>

                            {selectedCountry && (
                                <div className="flex gap-1 flex-col">
                                    <label htmlFor="state" className="font-medium text-lg">
                                        State
                                    </label>

                                    <select
                                        name="state"
                                        id="state"
                                        value={selectedState}
                                        {...register("state")}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    >
                                        <option value="">Select State</option>
                                        {State &&
                                            State.getStatesOfCountry(selectedCountry).map((st) => (
                                                <option key={st.isoCode} value={st.isoCode}>
                                                    {st.name}
                                                </option>
                                            ))}
                                    </select>

                                    {errors.state && (
                                        <span className="text-red-500 text-sm font-medium pl-1">
                                            {errors.state.message}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-1 flex-col">
                                <label htmlFor="pincode" className="font-medium text-lg">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    id="pincode"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    placeholder="Enter Pincode"
                                    {...register("pincode")}
                                />

                                {errors.pincode && (
                                    <span className="text-red-500 text-sm font-medium pl-1">
                                        {errors.pincode.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex w-full justify-between pt-2">
                                <button
                                    className="bg-gray-600 hover:bg-gray-700 font-medium text-neutral-100 py-2 px-4 rounded duration-200 items-end"
                                    onClick={backHandler}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 font-medium text-neutral-100 py-2 px-4 rounded duration-200 items-end"
                                >
                                    Continue
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ShippingInfo;
