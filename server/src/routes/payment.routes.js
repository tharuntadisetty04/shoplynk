import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    processPayment,
    sendApiKey,
} from "../controllers/payment.controller.js";

const router = Router();

router.route("/process-payment").post(verifyJWT, processPayment);
router.route("/payment-apikey").get(verifyJWT, sendApiKey);

export default router;
