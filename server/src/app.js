import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
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

//product routes
app.use("/api/v1/products", productRouter);

//user route
app.use("/api/v1/user", userRouter);

app.on("error", (err) => {
    console.log("App error : ", err);
    throw err;
});

export default app;
