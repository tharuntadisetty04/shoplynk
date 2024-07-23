import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

//create new order
const newOrder = asyncHandler(async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (
        !shippingInfo ||
        !orderItems ||
        !paymentInfo ||
        itemsPrice === null ||
        taxPrice === null ||
        shippingPrice === null ||
        totalPrice === null
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const { address, city, state, country, pincode, phoneNo } = shippingInfo;

    if (!address || !city || !state || !country || !pincode || !phoneNo) {
        throw new ApiError(400, "Complete shipping information is required");
    }

    const phoneNoPattern = /^\d{10}$/;
    if (!phoneNoPattern.test(phoneNo)) {
        throw new ApiError(400, "Invalid phone number format");
    }

    const pincodePattern = /^\d{6}$/;
    if (!pincodePattern.test(pincode)) {
        throw new ApiError(400, "Invalid pincode format");
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user: req.user._id,
        paidAt: Date.now(),
    });

    if (!order) {
        throw new ApiError(500, "Order creation failed");
    }

    res.status(201).json(
        new ApiResponse(201, order, "Order created successfully")
    );
});

//get single order
const getSingleOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "username email")
        .lean();

    if (!order) {
        throw new ApiError(404, "Order not found with the given ID");
    }

    const productId = order.orderItems.map((item) => item.productDetails);

    const products = await Product.aggregate([
        {
            $match: {
                _id: { $in: productId },
                owner: req.user._id,
            },
        },
        {
            $project: {
                _id: 1,
            },
        },
    ]);

    if (products.length === 0) {
        throw new ApiError(403, "Order does not belong to this seller");
    }

    res.status(200).json(
        new ApiResponse(200, order, "Order details fetched successfully")
    );
});

//get all orders for a specific seller
const getSellerOrders = asyncHandler(async (req, res) => {
    const sellerId = req.user._id;

    const products = await Product.find({ owner: sellerId });

    if (!products || products.length === 0) {
        throw new ApiError(404, "Seller has no products");
    }

    const productIds = products.map((product) => product._id);

    const orders = await Order.find({
        "orderItems.productDetails": { $in: productIds },
    })
        .populate("orderItems.productDetails", "name price")
        .populate("user", "username email");

    if (!orders || orders.length === 0) {
        throw new ApiError(404, "No orders found for this seller.");
    }

    res.status(200).json(
        new ApiResponse(200, orders, "All orders fetched successfully")
    );
});

//get current user orders
const getCurrentUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).lean();

    if (!orders) {
        throw new ApiError(404, "No orders found for the current user");
    }

    res.status(200).json(
        new ApiResponse(200, orders, "Order details fetched successfully")
    );
});

//update order status
const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Processing", "Shipped", "Delivered"].includes(status)) {
        throw new ApiError(400, "Invalid status provided");
    }

    const order = await Order.findById(id)
        .populate("user", "username email")
        .populate("orderItems.productDetails", "name price");

    if (!order) {
        throw new ApiError(404, "Order not found with this Id");
    }

    const productId = order.orderItems.map((item) => item.productDetails._id);

    const products = await Product.find({
        _id: { $in: productId },
        owner: req.user._id,
    });

    if (products.length === 0) {
        throw new ApiError(403, "Order does not belong to this seller");
    }

    if (order.orderStatus === "Delivered") {
        throw new ApiError(400, "You have already delivered this order");
    }

    if (status === "Shipped") {
        for (const item of order.orderItems) {
            await updateStock(item.productDetails._id, item.quantity);
        }
    }

    order.orderStatus = status;

    if (status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    try {
        const updatedOrder = await order.save({ validateBeforeSave: false });

        res.status(200).json(
            new ApiResponse(
                200,
                updatedOrder,
                "Order status updated successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, `Error saving order: ${error.message}`);
    }
});

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, `Product not found with ID: ${id}`);
    }

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

//delete order
const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
        throw new ApiError(404, `Order not found with ID: ${id}`);
    }

    res.status(200).json(
        new ApiResponse(200, {}, "Order deleted successfully")
    );
});

export {
    newOrder,
    getSingleOrder,
    getCurrentUserOrders,
    getSellerOrders,
    updateOrder,
    deleteOrder,
};
