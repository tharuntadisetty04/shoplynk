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

const router = Router();

router.route("/products").get(getAllProducts);

//admin routes
router.route("/admin/new").post(verifyJWT, verifySeller, createProduct);
router
    .route("/:id")
    .patch(verifyJWT, verifySeller, updateProduct)
    .delete(verifyJWT, verifySeller, deleteProduct)
    .get(verifyJWT, getProductDetails);

export default router;
