import { Router } from "express";
import {
    deleteOrder,
    getCurrentUserOrders,
    getSellerOrders,
    getSingleOrder,
    newOrder,
    updateOrder,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifySeller } from "../middlewares/verifySeller.middleware.js";

const router = Router();

router.route("/new").post(verifyJWT, newOrder);
router.route("/my-orders").get(verifyJWT, getCurrentUserOrders);

//seller routes
router.route("/admin/all").get(verifyJWT, verifySeller, getSellerOrders);
router
    .route("/admin/order/:id")
    .get(verifyJWT, verifySeller, getSingleOrder)
    .patch(verifyJWT, verifySeller, updateOrder)
    .delete(verifyJWT, verifySeller, deleteOrder);

export default router;
