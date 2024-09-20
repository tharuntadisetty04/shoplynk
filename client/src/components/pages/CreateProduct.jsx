import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleHelmet from "../utils/TitleHelmet";
import { useDispatch, useSelector } from "react-redux";
import createProductImg from "../../assets/create-product.jpg";

const categories = [
    "fashion",
    "electronics",
    "personalcare",
    "home",
    "sports",
    "groceries",
];

const createProductSchema = z.object({
    name: z.string().min(1, "Product Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce
        .string()
        .regex(/^\d{1,6}$/, "Price must be between 1 and 900000")
        .refine((val) => parseInt(val, 10) >= 1 && parseInt(val, 10) <= 900000, {
            message: "Price must be between 1 and 900000",
        }),
    images: z.any(),
    category: z.enum(categories, {
        errorMap: () => ({ message: "Invalid category provided" }),
    }),
    stock: z.coerce
        .string()
        .regex(/^\d{1,4}$/, "Stock must be between 1 and 9999")
        .refine((val) => parseInt(val, 10) >= 1 && parseInt(val, 10) <= 9999, {
            message: "Stock must be between 1 and 9999",
        }),
});

const CreateProduct = () => {
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector((state) => state.newProduct);

    const [step, setStep] = useState(1);
    const [imagesPreview, setImagesPreview] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
    } = useForm({
        resolver: zodResolver(createProductSchema),
    });

    const handleNext = async () => {
        const isValid = await trigger(["name", "price", "description"]);
        if (isValid) {
            setStep(2);
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        setStep(1);
    };

    const handleInputChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            setImagesPreview([]);
        }

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setValue("images", files);
                }
            };
            reader.onerror = () => {
                toast.error("There was an error reading the file.");
            };
            reader.readAsDataURL(file);
        });
    };

    const onSubmit = async (data) => {
        console.log(data);
    };

    return (
        <div className="create-product h-full w-full flex justify-center lg:justify-start items-start lg:gap-12 mb-4">
            <TitleHelmet title={"Create Product | ShopLynk"} />

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

            <div className="create-product-img lg:-mt-6">
                <img
                    src={createProductImg}
                    alt="Create Product Image"
                    className="mix-blend-multiply lg:block hidden"
                    width={460}
                />
            </div>

            <form
                className="lg:w-[22rem] w-full p-4 rounded-md shadow-md bg-slate-200 lg:mt-2.5"
                encType="multipart/form-data"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-4 w-full">
                    {step === 1 && (
                        <>
                            <div className="flex gap-1 flex-col">
                                <label className="font-medium text-lg">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Product Name"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm font-medium pl-0.5">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-1 flex-col">
                                <label className="font-medium text-lg">Price</label>
                                <input
                                    type="text"
                                    placeholder="Enter Price"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    {...register("price", { valueAsNumber: true })}
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm font-medium pl-0.5">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-1 flex-col">
                                <label className="font-medium text-lg">Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="Enter Product Description"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600 resize-none overflow-y-auto"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm font-medium pl-0.5">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="rounded bg-blue-600 px-4 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 w-fit"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="flex gap-1 flex-col">
                                <label className="font-medium text-lg">Category</label>
                                <select
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    {...register("category")}
                                >
                                    <option value="" disabled>
                                        -- Select category --
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm font-medium pl-0.5">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-1 flex-col">
                                <label className="font-medium text-lg">Stock</label>
                                <input
                                    type="text"
                                    placeholder="Enter Stock"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    {...register("stock", { valueAsNumber: true })}
                                />
                                {errors.stock && (
                                    <p className="text-red-500 text-sm font-medium pl-0.5">
                                        {errors.stock.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-1 flex-col">
                                <label htmlFor="productImages" className="font-medium text-lg">
                                    Image(s):
                                </label>

                                {window.innerWidth < 700 ? (
                                    <div className="mt-2">
                                        <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                                            Choose File
                                            <input
                                                type="file"
                                                name="productImages"
                                                accept="image/*"
                                                multiple
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <span className="ml-3">{imagesPreview.length} files</span>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        name="productImages"
                                        accept="image/*"
                                        multiple
                                        onChange={handleInputChange}
                                        className="mx-auto pl-6"
                                    />
                                )}

                                {imagesPreview && (
                                    <div className="overflow-x-auto flex gap-2 mt-2">
                                        {imagesPreview.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt="Product Preview"
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                )}
                                {errors.images && (
                                    <p className="text-red-500 text-sm font-medium pl-0.5">
                                        {errors.images.message}
                                    </p>
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
                                    Create
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
