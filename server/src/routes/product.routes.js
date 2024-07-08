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

router.route("/").get(getAllProducts);

//seller routes
router.route("/new").post(verifyJWT, verifySeller, createProduct);
router
    .route("/:id")
    .patch(verifyJWT, verifySeller, updateProduct)
    .delete(verifyJWT, verifySeller, deleteProduct)
    .get(verifyJWT, verifySeller, getProductDetails);

export default router;
