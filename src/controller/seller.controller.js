import ProductModel from "../model/product.model.js";

export default class SellerController {
  async getSellerDashboard(req, res) {
    try {
      // get seller products only
      const sellerId = req.session.user._id;
      const products = await ProductModel.find({ seller: sellerId });

      // calculate stats
      const totalProducts = products.length;
      // Revenue will be calculated from completed orders
      // once the order system is implemented.
      const totalRevenue = 0;
      res.render("seller-dashboard", {
        products,
        totalProducts,
        totalRevenue,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error loading seller dashboard");
    }
  }
}
