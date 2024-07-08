import { Router } from "express";
import {
    forgotPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/forgot-password").post(verifyJWT, forgotPassword);

export default router;
