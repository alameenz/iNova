import ProductModel from "../model/product.model.js";

export function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

export function requireSeller(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  if (req.session.user.role !== "seller") {
    return res.status(403).send("Seller access required");
  }
  next();
}

export async function requireSellerOwnership(req, res, next) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    if (product.seller.toString() !== req.session.user._id) {
      return res.status(403).send("You cannot modify another seller's product");
    }

    req.product = product;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}
