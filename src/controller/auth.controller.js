import bcrypt from "bcrypt";
import UserModel from "../model/user.model.js";
import { validateLogin, validateSignup } from "../utils/validation.js";
import { sendSellerOTP } from "../utils/email.js";

export default class AuthController {
  getAccount(req, res) {
    res.render("account", {
      user: req.session.user,
    });
  }

  async signup(req, res) {
    try {
      const errors = validateSignup(req.body);

      if (errors.length > 0) {
        errors.forEach((err) => req.flash("error", err));
        return res.redirect("/signup");
      }

      const name = req.body.name.trim();
      const email = req.body.email.trim();

      const { password } = req.body;

      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        req.flash("error", "Email already registered");
        return res.redirect("/signup");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role: "customer",
      });

      req.flash("success", "Account created! Please log in.");
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      req.flash("error", "Signup failed. PLease try again");
      res.redirect("/signup");
    }
  }

  async login(req, res) {
    try {
      const errors = validateLogin(req.body);

      if (errors.length > 0) {
        errors.forEach((err) => req.flash("error", err));
        return res.redirect("/login");
      }

      const email = req.body.email.trim().toLowerCase();
      const { password } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }

      req.session.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      req.flash("success", `Welcome back, ${user.name}!`);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      req.flash("error", "Login failed. Please try again.");
      res.redirect("/login");
    }
  }

  logout(req, res) {
    req.session.destroy((error) => {
      if (error) {
        req.flash("error", "Logout failed.");
      }

      res.redirect("/");
    });
  }

  async becomeSellerRequest(req, res) {
    try {
      if (req.session.user.role === "seller") {
        req.flash("warning", "You are already a seller!");
        return res.redirect("/seller/dashboard");
      }
      const userId = req.session.user._id;

      const user = await UserModel.findById(userId);

      if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/account");
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      req.session.sellerOTP = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };

      await sendSellerOTP(user.email, otp);
      req.flash("success", "Verification code sent to your email!");
      res.redirect("/verify-seller");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error upgrading to seller. Please try again.");
      res.redirect("/account");
    }
  }

  async verifySellerOTP(req, res) {
    try {
      const { otp } = req.body;

      const sellerOTP = req.session.sellerOTP;

      if (!sellerOTP) {
        req.flash("error", "Verification code expired or not requested");
        return res.redirect("/become-seller");
      }

      if (Date.now() > sellerOTP.expiresAt) {
        delete req.session.sellerOTP;
        req.flash("error", "Verification code has expired. Please try again.");
        return res.redirect("/become-seller");
      }

      if (otp !== sellerOTP.otp) {
        req.flash("error", "Invalid verification code. Please try again.");
        return res.redirect("/verify-seller");
      }

      const userId = req.session.user._id;

      await UserModel.findByIdAndUpdate(
        userId,
        {
          role: "seller",
        },
        {
          runValidators: true,
        },
      );

      // Update current session
      req.session.user.role = "seller";

      // Remove OTP after successful verification
      delete req.session.sellerOTP;

      req.flash("success", "Congratulations! You are now a seller! 🎉");
      res.redirect("/seller/dashboard");
    } catch (error) {
      console.error(error);
      req.flash("error", "Seller verification failed. Please try again.");
      res.redirect("/verify-seller");
    }
  }

  getSellerVerification(req, res) {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.role === "seller") {
      return res.redirect("/seller/dashboard");
    }

    res.render("verify-seller");
  }

  getBecomeSeller(req, res) {
    if (req.session.user.role === "seller") {
      return res.redirect("/seller/dashboard");
    }
    res.render("become-seller");
  }

  // view rendering
  getSignupForm(req, res) {
    res.render("signup");
  }

  getLoginForm(req, res) {
    res.render("login");
  }
}
