import express from "express";
import ProductController from "../controller/product.controller.js";

const router = express.Router();

const productController = new ProductController();

router.get("/", productController.mainPage);

router.get("/products", productController.getproducts);

router.get("/products/new", productController.getAddForm);
router.post("/products", productController.addNewProducts);

router.get("/products/edit/:id", productController.getUpdateForm);
router.post("/products/update/:id", productController.updateProduct);

router.post("/products/delete/:id", productController.deleteProduct);

router.get("/products/details/:id", productController.getProductCard);

export default router;
