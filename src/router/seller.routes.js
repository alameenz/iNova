import express from "express";
import { requireSeller } from "../middleware/auth.middleware.js";
import SellerController from "../controller/seller.controller.js";

const router = express.Router();

const sellerController = new SellerController();

router.get(
  "/seller/dashboard",
  requireSeller,
  sellerController.getSellerDashboard,
);

export default router;
