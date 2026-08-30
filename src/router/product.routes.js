import express from "express";
import {
  requireSeller,
  requireSellerOwnership,
} from "../middleware/auth.middleware.js";
import ProductController from "../controller/product.controller.js";

const router = express.Router();

const productController = new ProductController();

router.get("/", productController.mainPage);
router.get("/products/new", requireSeller, productController.getAddForm);
router.post("/products", requireSeller, productController.addNewProducts);

router.get(
  "/products/edit/:id",
  requireSeller,
  requireSellerOwnership,
  productController.getUpdateForm,
);
router.post(
  "/products/update/:id",
  requireSeller,
  requireSellerOwnership,
  productController.updateProduct,
);
router.post(
  "/products/delete/:id",
  requireSeller,
  requireSellerOwnership,
  productController.deleteProduct,
);

router.get("/products", productController.getproducts);
router.get("/products/details/:id", productController.getProductCard);
export default router;
