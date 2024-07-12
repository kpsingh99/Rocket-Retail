import express from "express";
import { myOrders, newOrder, allOrders, getSingleOrder, processOrder, deleteOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// route - /api/v1/order/new.
app.post("/new", newOrder);
app.get("/my", myOrders);
app.get("/all", adminOnly, allOrders);
app
    .route("/:id")
    .get(getSingleOrder)
    .put(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);
export default app;
