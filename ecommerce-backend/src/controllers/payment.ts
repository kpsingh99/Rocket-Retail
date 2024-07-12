import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import { rm } from "fs";
import ErrorHandler from "../utils/utility-class.js";
// import { stripe } from "../app.js";


// export const createPaymentIntent = TryCatch(async (req, res, next) => {

//   const {amount} = req.body;
//   if(!amount) return next(new ErrorHandler("Please Enter amount.", 400));

//   const paymentIntent = await stripe.paymentIntents.create({amount: Number(amount) * 100, 
//     currency: "inr",
//   })

//   return res.status(201).json({
//     success: true,
//     clientSecret: paymentIntent.client_secret,
//   });
// });

export const newCoupon = TryCatch(async (req, res, next) => {

  const {coupon, amount} = req.body;

  if(!coupon || !amount) return next(new ErrorHandler("Invalid Product ID.", 404));

  await Coupon.create({code: coupon, amount});

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {

  const {coupon} = req.query;
  const discount = await Coupon.findOne({code: coupon});
  if(!discount) return next(new ErrorHandler("Invalid Coupon Code.", 404));

  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});



// small data no need to caching..
export const allCoupons = TryCatch(async (req, res, next) =>{
  const coupons = await Coupon.find({});

  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) =>{
  const {id} = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);
  if(!coupon) return next(new ErrorHandler("Invalid Coupon ID.",400));
  return res.status(200).json({
    success: true, 
    message: `Coupon ${coupon} Deleted Successfully.`
  });
});