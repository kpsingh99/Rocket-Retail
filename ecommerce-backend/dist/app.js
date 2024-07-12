// what is the function of next function ? 
import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import multer from 'multer';
import NodeCache from 'node-cache';
import { config } from "dotenv";
import morgan from 'morgan';
import cors from 'cors';
// import Razorpay from 'razorpay';
// Importing Routes.
import userRoute from './routes/user.js';
import productRoute from './routes/products.js';
import orderRoute from './routes/order.js';
import payemntRoute from './routes/payment.js';
import dashboardRoutes from './routes/stats.js';
config({
    path: "./.env"
});
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
// const razorKey = process.env.RAZOR_KEY || "";
connectDB(mongoURI);
// export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer({ dest: 'uploads/' });
app.get("/", (req, res) => {
    res.send("API working with /api/v1");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", payemntRoute);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/uploads", express.static("uploads"));
// Middleware for Error Handling. 
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Express is working on http://localhost:${port}`);
});
