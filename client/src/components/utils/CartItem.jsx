import { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { addItemsToCart, removeCartItem } from "../../redux/actions/cartAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    const [localQuantity, setLocalQuantity] = useState(item.quantity);

    debounce(() => {
        useEffect(() => {
            setLocalQuantity(item.quantity);
        }, [item.quantity]);
    }, 300);

    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (newQty > stock) {
            return;
        }

        dispatch(addItemsToCart(id, newQty));
    };

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty <= 0) {
            return;
        }

        dispatch(addItemsToCart(id, newQty));
    };

    const debouncedIncreaseQuantity = debounce(() => {
        increaseQuantity(item.product, localQuantity, item.stock);
    }, 300);

    const debouncedDecreaseQuantity = debounce(() => {
        decreaseQuantity(item.product, localQuantity, item.stock);
    }, 300);

    const handleIncrease = () => {
        if (localQuantity + 1 <= item.stock) {
            setLocalQuantity((prevQty) => prevQty + 1);
            debouncedIncreaseQuantity();
        } else {
            toast.warning(`Stock limit exceeded. Max: ${item.stock}`);
        }
    };

    const handleDecrease = () => {
        if (localQuantity - 1 > 0) {
            setLocalQuantity((prevQty) => prevQty - 1);
            debouncedDecreaseQuantity();
        } else {
            toast.warning("Quantity cannot be less than 1");
        }
    };

    const deleteCartItem = (id) => {
        dispatch(removeCartItem(id));
        toast.success("Item removed from Cart");
    };

    return window.innerWidth > 500 ? (
        <div className="flex items-center justify-between p-4 mb-4 last:mb-0 border-b bg-white rounded">
            <Link
                to={`/products/${item.product}`}
                className="flex items-center group w-64"
            >
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded duration-200 group-hover:shadow-md"
                />

                <div className="lg:ml-4 ml-2">
                    <h3 className="text-lg font-medium lg:w-40 w-36 truncate">
                        {item.name}
                    </h3>
                </div>
            </Link>

            <div className="flex items-center w-[8.5rem]">
                <button
                    className="duration-200 border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-600 hover:text-neutral-100 hover:border-blue-600 lg:px-3 px-2 rounded font-semibold lg:text-xl"
                    onClick={handleDecrease}
                >
                    -
                </button>

                <input
                    type="text"
                    value={localQuantity}
                    className="lg:w-12 w-8 lg:h-[1.92rem] h-[1.64rem] text-center mx-2 border-2 border-blue-600 rounded outline-none bg-white"
                    readOnly
                />

                <button
                    className="duration-200 border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-600 hover:text-neutral-100 hover:border-blue-600 lg:px-3 px-2 rounded font-semibold lg:text-xl"
                    onClick={handleIncrease}
                >
                    +
                </button>
            </div>

            <p className="w-24 text-center font-medium">₹{item.price.toFixed(2)}</p>
            <p className="w-32 text-center font-medium">
                ₹{(item.price * localQuantity).toFixed(2)}
            </p>

            <button
                className="text-2xl -mt-1 text-gray-700 hover:text-red-500 duration-200"
                onClick={() => deleteCartItem(item.product)}
            >
                <MdDeleteOutline />
            </button>
        </div>
    ) : (
        <div className="flex items-start p-4 mb-4 border rounded-lg bg-white shadow-sm justify-start">
            <Link
                to={`/products/${item.product}`}
                className="w-20 h-24 flex-shrink-0"
            >
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                />
            </Link>

            <div className="ml-4 flex-grow">
                <Link
                    to={`/products/${item.product}`}
                    className="block truncate w-40 text-lg font-medium pb-2"
                >
                    {item.name}
                </Link>

                <div className="flex">
                    <p className="flex items-center justify-center w-fit gap-1">
                        <span>Qty:</span>
                        {localQuantity}
                    </p>

                    <div className="flex items-center w-[8.5rem] pl-4">
                        <button
                            className="duration-200 border border-blue-600 bg-white text-blue-700 hover:bg-blue-600 hover:text-neutral-100 hover:border-blue-600 font-medium px-1.5 rounded"
                            onClick={handleDecrease}
                        >
                            -
                        </button>

                        <input
                            type="text"
                            value={localQuantity}
                            className="w-8 text-center mx-1 border border-blue-600 rounded outline-none bg-white"
                            readOnly
                        />

                        <button
                            className="duration-200 border border-blue-600 bg-white text-blue-700 hover:bg-blue-600 hover:text-neutral-100 hover:border-blue-600 font-medium px-1.5 rounded"
                            onClick={handleIncrease}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex items-center pt-2 justify-start">
                    <p className="text-base text-gray-700 mr-2">
                        ₹{item.price}x{localQuantity} =
                    </p>

                    <p className="text-base font-medium text-blue-600">
                        ₹{item.price * item.quantity}
                    </p>
                </div>
            </div>

            <button
                className="text-xl text-gray-500 hover:text-red-500 ml-4 relative -top-3 right-6"
                onClick={() => deleteCartItem(item.product)}
            >
                <MdDeleteOutline />
            </button>
        </div>
    );
};

export default CartItem;
