import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ApiError(400, message);
    }

    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new ApiError(400, message);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default errorHandler;
