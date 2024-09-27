import { Router } from "express";
import {
    deleteUserProfile,
    forgotPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
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

router.use(verifyJWT);

// Secured routes
router.route("/logout").post(logoutUser);
router.route("/current-user").get(getCurrentUser);
router.route("/password/update").patch(updatePassword);
router.route("/update-profile").patch(upload.single("avatar"), updateProfile);
router.route("/delete-profile").delete(deleteUserProfile);
router.route("/update-role").patch(updateUserRole);

export default router;
