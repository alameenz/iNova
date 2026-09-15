import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import CartController from "../controller/cart.controller.js";

const router = express.Router();

const cartController = new CartController();

router.get("/cart", requireAuth, cartController.getCart);
router.post("/cart/add/:id", requireAuth, cartController.addToCart);
router.post("/cart/update/:id", requireAuth, cartController.updateCartItem);
router.post("/cart/remove/:id", requireAuth, cartController.removeCartItem);

export default router;
