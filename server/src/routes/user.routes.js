import { Router } from "express";
import {
    deleteUserProfile,
    forgotPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    renewAccessToken,
    resetPassword,
    updatePassword,
    updateProfile,
    updateUserRole,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/password/update").patch(verifyJWT, updatePassword);
router.route("/update-profile").patch(upload.single("avatar"), verifyJWT, updateProfile);
router.route("/delete-profile").delete(verifyJWT, deleteUserProfile);
router.route("/renew-token").post(renewAccessToken);
router.route("/update-role").patch(verifyJWT, updateUserRole);

export default router;
