import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProductDetails,
    getproducts,
    updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(getproducts);

//admin routes
router.route("/new").post(createProduct);
router.route("/:id").patch(updateProduct).delete(deleteProduct).get(getProductDetails);

export default router;