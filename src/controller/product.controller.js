import ProductModel from "../model/product.model.js";
import { validateObjectId, validateProduct } from "../utils/validation.js";

export default class ProductController {
  mainPage(req, res) {
    res.render("home");
  }

  // GET ALL PRODUCTS

  async getproducts(req, res) {
    try {
      const products = await ProductModel.find().populate("seller","name email");
      res.render("product-view", {
        products,
      });
    } catch (error) {
      console.error(error);

      res.status(500).send("Error while fetching products");
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
        return res.status(400).send(errors.join("<br>"));
      }

      const { name, desc, price, imageUrl } = req.body;

      await ProductModel.create({
        name: name.trim(),
        desc: desc.trim(),
        price: Number(price),
        imageUrl: imageUrl.trim(),
        seller: req.session.user._id,
      });

      res.redirect("/products");
    } catch (error) {
      console.error(error);

      res.status(500).send("Error while adding product");
    }
  }

  // GET UPDATE PRODUCT FORM

  async getUpdateForm(req, res) {
    try {
      const id = req.params.id;

      if (!validateObjectId(id)) {
        return res.status(400).send("Invalid product ID");
      }

      const product = await ProductModel.findById(id);

      if (!product) {
        return res.status(404).send("Product not found!!");
      }

      res.render("update-product", {
        product,
      });
    } catch (error) {
      console.error(error);

      res.status(500).send("Error while loading update form");
    }
  }

  // UPDATE PRODUCT

  async updateProduct(req, res) {
    try {
      const id = req.params.id;

      if (!validateObjectId(id)) {
        return res.status(400).send("Invalid product ID");
      }

      const errors = validateProduct(req.body);

      if (errors.length > 0) {
        return res.status(400).send(errors.join("<br>"));
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
        return res.status(404).send("Product not found");
      }

      res.redirect("/products");
    } catch (error) {
      console.error(error);

      res.status(500).send("Error while updating product");
    }
  }

  // DELETE PRODUCT

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;

      if (!validateObjectId(id)) {
        return res.status(400).send("Invalid product ID");
      }

      const product = await ProductModel.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      res.redirect("/products");
    } catch (error) {
      console.error(error);

      res.status(500).send("Error while deleting product");
    }
  }

  // GET PRODUCT DETAILS

  async getProductCard(req, res) {
    try {
      const id = req.params.id;

      if (!validateObjectId(id)) {
        return res.status(400).send("Product not found");
      }

      const product = await ProductModel.findById(id).populate("seller", "name email");

      if (!product) {
        return res.status(404).send("Product not found");
      }

      res.render("product-details", {
        product,
      });
    } catch (error) {
      console.error(error);

      res.status(500).send("Error while fetching product details");
    }
  }
}
