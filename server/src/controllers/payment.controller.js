import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = asyncHandler(async (req, res) => {
    const { amount, currency = "inr" } = req.body;

    const newPayment = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        metadata: {
            company: "Shoplynk",
        },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { client_secret: newPayment.client_secret },
                "Payment created successfully"
            )
        );
});

export const sendApiKey = asyncHandler(async (req, res) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_PUBLIC_API_KEY });
});
