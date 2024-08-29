import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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

//Routes
import productRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";

//product routes
app.use("/api/v1/products", productRouter);

//user route
app.use("/api/v1/user", userRouter);

//order route
app.use("/api/v1/orders", orderRouter);

app.on("error", (err) => {
    console.log("App error : ", err);
    throw err;
});

export default app;
