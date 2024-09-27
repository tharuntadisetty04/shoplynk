import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

//create new order
const newOrder = asyncHandler(async (req, res, next) => {
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
        return next(new ApiError(400, "All fields are required"));
    }

    const { address, city, state, country, pincode, phoneNo } = shippingInfo;

    if (!address || !city || !state || !country || !pincode || !phoneNo) {
        return next(
            new ApiError(400, "Complete shipping information is required")
        );
    }

    const phoneNoPattern = /^\d{10}$/;
    if (!phoneNoPattern.test(phoneNo)) {
        return next(new ApiError(400, "Invalid phone number format"));
    }

    const pincodePattern = /^\d{6}$/;
    if (!pincodePattern.test(pincode)) {
        return next(new ApiError(400, "Invalid pincode format"));
    }

    try {
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
            return next(new ApiError(500, "Order creation failed"));
        }

        res.status(201).json(
            new ApiResponse(201, order, "Order created successfully")
        );
    } catch (error) {
        return next(
            new ApiError(500, error?.message || "Internal server error")
        );
    }
});

//get single order
const getSingleOrder = asyncHandler(async (req, res, next) => {
    const sellerId = req.user._id;

    if (!req.params?.id) {
        return next(new ApiError(400, "Order ID is required"));
    }

    const order = await Order.findById(req.params.id)
        .populate("user", "username email")
        .populate("orderItems.product", "name owner");

    if (!order) {
        return next(new ApiError(404, "Order not found with the given ID"));
    }

    const sellerItems = order.orderItems.filter((item) => {
        if (!item.product) {
            return next(
                new ApiError(
                    400,
                    `Product associated with order item ${item._id} has been deleted.`
                )
            );
        }
        return item.product.owner.equals(sellerId);
    });

    if (!sellerItems) {
        return next(
            new ApiError(
                403,
                "No products in this order are owned by the seller"
            )
        );
    }

    order.orderItems = sellerItems;

    res.status(200).json(
        new ApiResponse(200, order, "Order details fetched successfully")
    );
});

//get all orders for a specific seller
const getSellerOrders = asyncHandler(async (req, res, next) => {
    const sellerId = req.user._id;

    const orders = await Order.find({
        "orderItems.product": { $exists: true },
    })
        .populate({
            path: "orderItems.product",
            select: "name owner",
        })
        .populate("user", "username email");

    if (!orders) {
        return next(new ApiError(404, "No orders found."));
    }

    const filteredOrders = orders
        .map((order) => {
            const sellerItems = order.orderItems.filter(
                (item) => item?.product && item.product.owner.equals(sellerId)
            );

            if (sellerItems.length > 0) {
                return {
                    ...order.toObject(),
                    orderItems: sellerItems,
                };
            }

            return null;
        })
        .filter((order) => order !== null);

    if (!filteredOrders) {
        return next(new ApiError(404, "No orders found for this seller."));
    }

    res.status(200).json(
        new ApiResponse(
            200,
            filteredOrders,
            "Seller orders fetched successfully"
        )
    );
});

//get current user orders
const getCurrentUserOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).lean();

    if (!orders) {
        return next(new ApiError(404, "No orders found for the current user"));
    }

    res.status(200).json(
        new ApiResponse(200, orders, "Order details fetched successfully")
    );
});

//update order status
const updateOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const sellerId = req.user._id;

    if (!["Processing", "Shipped", "Delivered"].includes(status)) {
        return next(new ApiError(400, "Invalid status provided"));
    }

    const order = await Order.findById(id)
        .populate("orderItems.product", "name owner")
        .populate("user", "username email");

    if (!order) {
        return next(new ApiError(404, "Order not found with this ID"));
    }

    const sellerItems = order.orderItems.filter(
        (item) => item?.product && item.product.owner.equals(sellerId)
    );

    if (!sellerItems) {
        return next(
            new ApiError(
                403,
                "Order does not contain products owned by this seller"
            )
        );
    }

    const alreadyDelivered = sellerItems.every(
        (item) => item.orderStatus === "Delivered"
    );

    if (status === "Delivered" && alreadyDelivered) {
        return next(new ApiError(400, "All items have already been delivered"));
    }

    if (status === "Shipped") {
        for (const item of sellerItems) {
            await updateStock(item.product._id, item.quantity);
        }
    }

    order.orderItems = order.orderItems.map((item) => {
        if (item?.product && item.product.owner.equals(sellerId)) {
            return {
                ...item.toObject(),
                orderStatus: status,
                ...(status === "Delivered" && { deliveredAt: Date.now() }),
            };
        }
        return item;
    });

    await order.save({ validateBeforeSave: false });

    const sellerOrderItems = order.orderItems
        .filter((item) => item?.product && item.product.owner.equals(sellerId))
        .map((item) => ({
            ...item.toObject(),
            product: {
                name: item.product.name,
                owner: item.product.owner,
            },
        }));

    const updatedOrder = { ...order.toObject(), orderItems: sellerOrderItems };

    res.status(200).json(
        new ApiResponse(200, updatedOrder, "Order status updated successfully")
    );
});

// Helper function to update stock
async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);

    if (!product) {
        return next(
            new ApiError(404, `Product not found with ID: ${productId}`)
        );
    }

    if (product.stock < quantity) {
        return next(
            new ApiError(400, `Insufficient stock for product ID: ${productId}`)
        );
    }

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

//delete order
const deleteOrder = asyncHandler(async (req, res, next) => {
    const sellerId = req.user._id;
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate(
        "orderItems.product",
        "owner"
    );

    if (!order) {
        return next(new ApiError(404, `Order not found with ID: ${orderId}`));
    }

    const remainingItems = order.orderItems.filter(
        (item) => item?.product && !item.product.owner.equals(sellerId)
    );

    if (remainingItems.length === 0) {
        await order.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Order deleted successfully"));
    }

    order.orderItems = remainingItems;
    await order.save();

    res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Seller's items removed from order successfully"
        )
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
