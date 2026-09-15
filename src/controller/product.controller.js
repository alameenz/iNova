import ProductModel from "../model/product.model.js";
import { validateObjectId, validateProduct } from "../utils/validation.js";

export default class ProductController {
  constructor() {
    // Auto-bind every method so `this` is never lost when routes pass
    // these methods by reference (e.g. router.get("/products", controller.getproducts)).
    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key !== "constructor" && typeof this[key] === "function") {
        this[key] = this[key].bind(this);
      }
    }
  }

  mainPage(req, res) {
    res.render("home");
  }

  // GET ALL PRODUCTS

  async getproducts(req, res) {
    try {
      const products = await ProductModel.find().populate(
        "seller",
        "name email",
      );
      res.render("product-view", {
        products,
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Error while fetching products");
      res.redirect("/");
    }
  }

  // GET ADD PRODUCT FORM

  getAddForm(req, res) {
    res.render("new-product");
  }

  // ADD NEW PRODUCT

  async addNewProducts(req, res) {
    try {
      const errors = validateProduct(req.body);
      if (errors.length > 0) {
        errors.forEach((err) => req.flash("error", err));
        return res.redirect("/products/new");
      }

      const { name, desc, price, imageUrl } = req.body;

      await ProductModel.create({
        name: name.trim(),
        desc: desc.trim(),
        price: Number(price),
        imageUrl: imageUrl.trim(),
        seller: req.session.user._id,
      });

      req.flash("success", "Product added successfully");
      res.redirect("/products");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error while adding product");
      res.redirect("/products/new");
    }
  }

  // GET UPDATE PRODUCT FORM

  async getUpdateForm(req, res) {
    try {
      const id = req.params.id;

      if (!validateObjectId(id)) {
        req.flash("error", "Invalid product ID");
        return res.redirect("/products");
      }

      const product = await ProductModel.findById(id);

      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
      }

      res.render("update-product", {
        product,
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Error while loading update form");
      res.redirect("/products");
    }
  }

  // UPDATE PRODUCT

  async updateProduct(req, res) {
    try {
      const id = req.params.id;

      if (!validateObjectId(id)) {
        req.flash("error", "Invalid product ID");
        return res.redirect("/products");
      }

      const errors = validateProduct(req.body);

      if (errors.length > 0) {
        errors.forEach((err) => req.flash("error", err));
        return res.redirect(`/products/edit/${id}`);
      }

      const { name, desc, price, imageUrl } = req.body;

      const product = await ProductModel.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          desc: desc.trim(),
          price: Number(price),
          imageUrl: imageUrl.trim(),
        },
        {
          runValidators: true,
        },
      );
      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
      }

      req.flash("success", "Product updated successfully");
      res.redirect("/products");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error while updating product");
      res.redirect("/products");
    }
  }

  // DELETE PRODUCT

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;

      if (!validateObjectId(id)) {
        req.flash("error", "Invalid product ID");
        return res.redirect("/products");
      }

      const product = await ProductModel.findByIdAndDelete(id);

      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
      }

      req.flash("success", "Product deleted");
      res.redirect("/products");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error while deleting product");
      res.redirect("/products");
    }
  }

  // GET PRODUCT DETAILS

  async getProductCard(req, res) {
    try {
      const id = req.params.id;

      if (!validateObjectId(id)) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
      }

      const product = await ProductModel.findById(id).populate(
        "seller",
        "name email",
      );

      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
      }

      res.render("product-details", {
        product,
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Error while fetching product details");
      res.redirect("/products");
    }
  }
}
