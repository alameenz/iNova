import express from "express";
import AuthController from "../controller/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

const authController = new AuthController();

router.get("/signup", authController.getSignupForm);

router.post("/signup", authController.signup);

router.get("/login", authController.getLoginForm);

router.post("/login", authController.login);

router.get("/account", requireAuth, authController.getAccount);

router.get("/become-seller", requireAuth, authController.getBecomeSeller);

router.post("/become-seller", requireAuth, authController.becomeSellerRequest);

router.get("/verify-seller", requireAuth, authController.getSellerVerification);

router.post("/verify-seller", requireAuth, authController.verifySellerOTP);

router.post("/logout", authController.logout);

export default router;
