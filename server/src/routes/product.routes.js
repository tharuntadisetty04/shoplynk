import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProductDetails,
    getAllProducts,
    updateProduct,
    createProductReview,
    getAllReviews,
    deleteReview,
    getSellerProducts,
    getSimilarProducts,
    getBestSellingProducts,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifySeller } from "../middlewares/verifySeller.middleware.js";
import { verifyOwner } from "../middlewares/verifyOwner.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/similar-products/:id").get(getSimilarProducts);
router.route("/best-products").get(getBestSellingProducts);

//secured routes
router.route("/review").post(verifyJWT, createProductReview);
router.route("/reviews").get(getAllReviews).delete(verifyJWT, deleteReview);

//admin routes
router
    .route("/admin/new")
    .post(upload.array("images"), verifyJWT, verifySeller, createProduct);
router.route("/admin/all").get(verifyJWT, verifySeller, getSellerProducts);
router
    .route("/admin/:id")
    .patch(upload.array("images"), verifyJWT, verifySeller, verifyOwner, updateProduct)
    .delete(verifyJWT, verifySeller, verifyOwner, deleteProduct);

export default router;
