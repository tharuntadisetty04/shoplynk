import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();

app.use(
    cors({
        // origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        origin: process.env.CORS_ORIGIN || "https://shoplynk.vercel.app",
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Server running ...");
});

// Routes
import productRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";

// Product routes
app.use("/api/v1/products", productRouter);

// User route
app.use("/api/v1/user", userRouter);

// Order route
app.use("/api/v1/orders", orderRouter);

// Payment route
app.use("/api/v1/payment", paymentRouter);

app.on("error", (err) => {
    console.log("App error: ", err);
    throw err;
});

export default app;
