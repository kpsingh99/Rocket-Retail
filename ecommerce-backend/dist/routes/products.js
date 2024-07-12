import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getLatestProducts, newProduct, getAllCategories, getAdminProducts, getSingleProduct, updateProduct, deleteProduct, getAllProducts } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
// To make things work fast we have to do caching.
// Create New Product - /api/v1/product
app.post("/new", adminOnly, singleUpload, newProduct);
// to get last 10 latest products.
app.get("/latest", getLatestProducts);
// to get All products with filters.
app.get("/all", getAllProducts);
app.get("/categories", getAllCategories);
// to get all products.
app.get("/admin-products", getAdminProducts);
// to get, update and delete app.
app
    .route("/:id")
    .get(getSingleProduct)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default app;
