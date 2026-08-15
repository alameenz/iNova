import ProductModel from "../model/product.model.js";

export default class ProductController {
  mainPage(req, res) {
    res.render("home");
  }

  async getproducts(req, res) {
    const products = await ProductModel.find();

    res.render("product-view", {
      products: products,
    });
  }

  getAddForm(req, res) {
    res.render("new-product");
  }

  async addNewProducts(req, res) {
    const { name, desc, price, imageUrl } = req.body;

    await ProductModel.create({ name, desc, price: Number(price), imageUrl });
    res.redirect("/products");
  }

  async getUpdateForm(req, res) {
    const id = req.params.id;

    const product = ProductModel.findById(id);

    if (!product) {
      return res.status(404).send("Product not found!!");
    }
    res.render("update-product", {
      product,
    });
  }

  async updateProduct(req, res) {
    const id = req.params.id;
    const { name, desc, price, imageUrl } = req.body;

    await ProductModel.findByIdAndUpdate(
      id,
      { name, desc, price: Number(price), imageUrl },
      { new: true },
    );

    res.redirect("/products");
  }

  async deleteProduct(req, res) {
    const id = req.params.id;

    await ProductModel.findByIdAndDelete(id);
    res.redirect("/products");
  }

  async getProductCard(req, res) {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("product-details", {
      product,
    });
  }
}
