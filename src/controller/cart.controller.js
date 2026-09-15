import CartModel from "../model/cart.model.js";
import ProductModel from "../model/product.model.js";
import { validateObjectId } from "../utils/validation.js";

const MAX_QUANTITY = 99;

function sanitizeQuantity(rawQuantity) {
  const quantity = parseInt(rawQuantity, 10);
  if (isNaN(quantity) || quantity < 1) return 1;
  if (quantity > MAX_QUANTITY) return MAX_QUANTITY;
  return quantity;
}

export default class CartController {
  constructor() {
    // Auto-bind every method so `this` is never lost when routes pass
    // these methods by reference (e.g. router.get("/cart", controller.getCart)).
    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key !== "constructor" && typeof this[key] === "function") {
        this[key] = this[key].bind(this);
      }
    }
  }

  // ADD PRODUCT TO CART

  async addToCart(req, res) {
    try {
      const productId = req.params.id;

      if (!validateObjectId(productId)) {
        req.flash("error", "Invalid product");
        return res.redirect("/products");
      }

      const product = await ProductModel.findById(productId);

      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
      }

      const quantity = sanitizeQuantity(req.body.quantity);
      const userId = req.session.user._id;

      let cart = await CartModel.findOne({ user: userId });

      if (!cart) {
        cart = await CartModel.create({ user: userId, items: [] });
      }

      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + quantity,
          MAX_QUANTITY,
        );
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();

      req.flash("success", `${product.name} added to cart`);
      res.redirect("/cart");
    } catch (error) {
      console.error(error);
      req.flash("error", "Could not add item to cart");
      res.redirect("/products");
    }
  }

  // VIEW CART

  async getCart(req, res) {
    try {
      const userId = req.session.user._id;

      const cart = await CartModel.findOne({ user: userId }).populate(
        "items.product",
      );

      // If a product was deleted after being added to someone's cart,
      // populate() leaves that item's `product` as null - filter those out.
      const items = (cart?.items || []).filter((item) => item.product);

      const cartTotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      res.render("cart", {
        items,
        cartTotal,
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Could not load your cart");
      res.redirect("/");
    }
  }

  // UPDATE ITEM QUANTITY

  async updateCartItem(req, res) {
    try {
      const productId = req.params.id;

      if (!validateObjectId(productId)) {
        req.flash("error", "Invalid product");
        return res.redirect("/cart");
      }

      const quantity = sanitizeQuantity(req.body.quantity);
      const userId = req.session.user._id;

      const cart = await CartModel.findOne({ user: userId });

      if (!cart) {
        req.flash("error", "Your cart is empty");
        return res.redirect("/cart");
      }

      const item = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (!item) {
        req.flash("error", "Item not found in cart");
        return res.redirect("/cart");
      }

      item.quantity = quantity;
      await cart.save();

      res.redirect("/cart");
    } catch (error) {
      console.error(error);
      req.flash("error", "Could not update cart");
      res.redirect("/cart");
    }
  }

  // REMOVE ITEM FROM CART

  async removeCartItem(req, res) {
    try {
      const productId = req.params.id;

      if (!validateObjectId(productId)) {
        req.flash("error", "Invalid product");
        return res.redirect("/cart");
      }

      const userId = req.session.user._id;

      await CartModel.updateOne(
        { user: userId },
        { $pull: { items: { product: productId } } },
      );

      req.flash("success", "Item removed from cart");
      res.redirect("/cart");
    } catch (error) {
      console.error(error);
      req.flash("error", "Could not remove item");
      res.redirect("/cart");
    }
  }
}
