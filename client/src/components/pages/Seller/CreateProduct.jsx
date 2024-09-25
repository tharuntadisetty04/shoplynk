import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleHelmet from "../../utils/TitleHelmet";
import { useDispatch, useSelector } from "react-redux";
import createProductImg from "../../assets/create-product.jpg";
import {
    clearErrors,
    createNewProduct,
} from "../../../redux/actions/ProductAction";
import { CREATE_PRODUCT_RESET } from "../../../redux/constants/ProductConstant";
import ItemLoader from "../../layout/Loaders/ItemLoader";

const categories = [
    "fashion",
    "electronics",
    "personalcare",
    "home",
    "sports",
    "groceries",
];

const createProductSchema = z.object({
    name: z.string().min(3, "Product Name is required"),
    description: z.string().min(3, "Description is required"),
    price: z.coerce
        .string()
        .regex(/^\d{1,6}$/, "Enter a valid Price")
        .refine((val) => parseInt(val, 10) >= 1 && parseInt(val, 10) <= 900000, {
            message: "Price must be between 1 and 900000",
        }),
    images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
    category: z.enum(categories, {
        errorMap: () => ({ message: "Invalid category provided" }),
    }),
    stock: z.coerce
        .string()
        .regex(/^\d{1,4}$/, "Enter a valid Stock")
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

    useEffect(() => {
        if (error) {
            toast.error(error, {
                onClose: () => dispatch(clearErrors()),
            });
        }

        if (success) {
            toast.success("Product Created Successfully!");
            dispatch({ type: CREATE_PRODUCT_RESET });
        }
    }, [error, success, dispatch]);

    const handleNext = async () => {
        const isValid = await trigger(["name", "price", "description"]);
        if (isValid) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleInputChange = (e) => {
        const { name, files } = e.target;

        if (name === "images" && files.length > 0) {
            const fileList = Array.from(files);

            const previews = [];
            setImagesPreview([]);

            fileList.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        previews.push(reader.result);
                        setImagesPreview([...previews]);
                    }
                };
                reader.onerror = () => {
                    toast.error("There was an error reading the file.");
                };
                reader.readAsDataURL(file);
            });

            setValue("images", fileList);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();

        if (!data.images || data.images.length === 0) {
            toast.error("Images are required");
            return;
        }

        for (const key in data) {
            if (key !== "images") {
                formData.append(key, data[key]);
            }
        }

        for (const image of data.images) {
            formData.append("images", image);
        }

        dispatch(createNewProduct(formData));
    };

    return loading ? (
        <div className="bg-transparent">
            <ItemLoader />
        </div>
    ) : (
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
                encType="multipart/form-data"
                onSubmit={handleSubmit(onSubmit)}
                className="lg:w-[22rem] w-full p-4 rounded-md shadow-md bg-slate-200 lg:mt-2.5"
            >
                <div className="flex flex-col gap-4 w-full">
                    {step === 1 && (
                        <>
                            <div className="flex gap-1 flex-col">
                                <label htmlFor="name" className="font-medium text-lg">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
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
                                <label htmlFor="price" className="font-medium text-lg">
                                    Price
                                </label>

                                <input
                                    type="text"
                                    name="price"
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
                                <label htmlFor="description" className="font-medium text-lg">
                                    Description
                                </label>

                                <textarea
                                    rows={2}
                                    name="description"
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
                                <label htmlFor="category" className="font-medium text-lg">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    className="outline-none duration-200 w-full px-3 py-2 rounded border-2 border-slate-200 focus:border-blue-600"
                                    {...register("category")}
                                >
                                    <option value="" disabled>
                                        -- Select category --
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat === "home"
                                                ? "Home & Kitchen"
                                                : cat === "personalcare"
                                                    ? "Personal Care"
                                                    : cat === "sports"
                                                        ? "Sports & Games"
                                                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                                <label htmlFor="stock" className="font-medium text-lg">
                                    Stock
                                </label>

                                <input
                                    type="text"
                                    name="stock"
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
                                {window.innerWidth < 700 ? (
                                    <div className="mt-2">
                                        <label
                                            htmlFor="images"
                                            className="bg-blue-500 text-neutral-100 px-4 py-2 rounded cursor-pointer"
                                        >
                                            Choose File
                                            <input
                                                id="images"
                                                type="file"
                                                name="images"
                                                accept="image/*"
                                                multiple
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                        </label>

                                        <span className="ml-3">
                                            {imagesPreview.length} files selected
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <label htmlFor="images" className="font-medium text-lg">
                                            Image(s):
                                        </label>

                                        <input
                                            type="file"
                                            name="images"
                                            accept="image/*"
                                            multiple
                                            onChange={handleInputChange}
                                            className="mx-auto pl-6"
                                        />
                                    </>
                                )}

                                {imagesPreview.length > 0 && (
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
                                    disabled={loading}
                                    className={`rounded bg-blue-600 px-3.5 py-2.5 font-semibold text-neutral-100 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 duration-200 ${loading ? "cursor-not-allowed" : "cursor-pointer"
                                        }`}
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
