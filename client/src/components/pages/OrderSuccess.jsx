import { Link } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import OrderSuccessImg from "../../assets/order-complete.jpg";
import TitleHelmet from "../utils/TitleHelmet";

const OrderSuccess = () => {
    return (
        <div className="flex md:flex-row flex-col items-center justify-center lg:-ml-12 lg:gap-20 w-full h-full lg:min-h-[60svh] md:min-h-[65svh] px-8 md:px-16 md:pb-0 pb-4">
            <TitleHelmet title={"Order Complete | ShopLynk"} />

            <div>
                <img
                    src={OrderSuccessImg}
                    alt="Order Success"
                    width={500}
                    className="mix-blend-multiply"
                />
            </div>

            <div className="flex flex-col items-center justify-center text-center">
                <div className="text-6xl text-blue-600">
                    <IoMdCheckmarkCircleOutline />
                </div>

                <h1 className="text-4xl font-bold text-blue-600">Order Complete!</h1>

                <p className="mt-4 text-gray-700">
                    Your order has been placed successfully!
                </p>

                <div className="flex items-center justify-between gap-4 mt-4">
                    <Link
                        to="/products"
                        className="bg-blue-600 hover:bg-blue-700 font-medium text-neutral-100 py-2 px-4 rounded duration-200"
                    >
                        Shop More
                    </Link>
                    <Link
                        to="/orders"
                        className="bg-blue-600 hover:bg-blue-700 font-medium text-neutral-100 py-2 px-4 rounded duration-200"
                    >
                        View Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
