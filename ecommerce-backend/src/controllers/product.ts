import { TryCatch } from "../middlewares/error.js";
import { NextFunction, Request, Response } from "express";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { faker } from '@faker-js/faker'
import { create } from "domain";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";



export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products = []

  if (myCache.has("latest-product")) products = JSON.parse(myCache.get("latest-product")!)
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-product", JSON.stringify(products));

  }


  return res.status(201).json({
    success: true,
    products,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {

  let categories;
  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);

  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(201).json({
    success: true,
    categories,
  });
});


export const getAdminProducts = TryCatch(async (req, res, next) => {

  let products;
  if (myCache.has('all-products')) {
    products = JSON.parse(myCache.get("all-products") as string);
  }
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }


  return res.status(201).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {

  const id = req.params.id;
  let product;
  if (myCache.has(`product-${id}`)) {
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  }
  else {
    product = await Product.find({});

    if (!product) return next(new ErrorHandler("Invalid Product ID.", 400));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }



  return res.status(201).json({
    success: true,
    product,
  });
});


export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction) => {

    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Please add Photo", 400));

    if (!name || !price || !stock || !category) {

      rm(photo.path, () => {
        console.log("Deleted.");
      })

      return next(new ErrorHandler("Please Enter all field Properly.", 400));
    }

    Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    });

    invalidateCache({product: true, admin: true});

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully"
    })

  }
);


export const updateProduct = TryCatch(
  async (
    req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Invalid Product ID.", 404))
    if (photo) {
      rm(product.photo, () => {
        console.log("Deleted");
      });
      product.photo = photo.path;
    }
    if (name) product.name = name;
    console.log(name);
    console.log("helloworld");
    if (stock) product.stock = stock;
    if (price) product.price = price;
    if (category) product.category = category;

    await product.save();

    invalidateCache({
      product: true, 
      productId: String(product._id),
      admin: true
    
    });


    return res.status(201).json({
      success: true,
      message: "Product Updated Successfully"
    })

  });


export const deleteProduct = TryCatch(async (req, res, next) => {

  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found!!.", 400));
  rm(product.photo!, () => {
    console.log("Product Photo Deleted.");
  });
  await product?.deleteOne();

  invalidateCache({product: true});    invalidateCache({product: true, productId: String(product._id)});


  return res.status(201).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});


export const getAllProducts = TryCatch(async (
  req: Request<{}, {}, {}, SearchRequestQuery>,
  res,
  next) => {

  const { } = req.query;
  const { search, sort, category, price } = req.query;
  const page = Number(req.query.page) || 1;

  const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
  const skip = limit * (page - 1);
  // Then it will not find lol in maclol

  const baseQuery: BaseQuery = {};

  if (search) {
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };
  }
  if (price) {
    baseQuery.price = {
      $lte: Number(price),
    };
  }

  if (category) baseQuery.category = category;

  const productsPromise = Product.find(baseQuery)
    .sort(sort && { price: sort === "asc" ? 1 : -1 })
    .limit(limit)
    .skip(skip);

  const [products, filteredOnlyProduct] = await Promise.all([
    productsPromise,
    Product.find(baseQuery),
  ]);
  const totalPage = Math.ceil(filteredOnlyProduct.length / limit);


  return res.status(201).json({
    success: true,
    products,
    totalPage,
  });
});


//  Program to generate all products.
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\9e59933c-4fa5-4511-98c5-52d0d6114767.png",
//       price: faker.commerce.price({min: 1500, max: 80000, dec: 0}),
//       stock: faker.commerce.price({min:0, max: 100, dec: 0}),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,

//     };
//     products.push(product);
//   }
//   await Product.create(products);

//   console.log({success: true});
// };

// generateRandomProducts(100);

// Program to delete products.

// const deleteRandomProducts = async (count: number = 10) =>{
//   const products = await Product.find({}).skip(2);

//   for(let i = 0;i<products.length;i++){
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({success: true});
// };

// deleteRandomProducts(100);