import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProductDetails,
    getAllProducts,
    updateProduct,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifySeller } from "../middlewares/verifySeller.middleware.js";
import { verifyOwner } from "../middlewares/verifyOwner.middleware.js";

const router = Router();

router.route("/").get(getAllProducts);
router.route("/:id").get(getProductDetails);

//admin routes
router.route("/admin/new").post(verifyJWT, verifySeller, createProduct);
router
    .route("/admin/:id")
    .patch(verifyJWT, verifySeller, verifyOwner, updateProduct)
    .delete(verifyJWT, verifySeller, verifyOwner, deleteProduct);

export default router;
