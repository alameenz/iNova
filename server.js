import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import productRouter from "./src/router/product.routes.js";
import { connectDB } from "./src/config/db.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src", "public")));

app.use(productRouter);
connectDB();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/");
});
