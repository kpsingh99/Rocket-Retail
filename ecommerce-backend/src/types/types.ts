import { BlobOptions } from "buffer";
import { Response, Request, NextFunction } from "express";
export interface NewUserRequestBody {
  name: string;
  _id: string;
  email: string;
  photo: string;
  gender: string;
  dob: Date;
}

export interface NewProductRequestBody {
  name: string;
  category: string;
  price: string;
  photo?: string;
  stock: number;
}

export type ControllerType = (
  req: Request<any>,
  res: Response, 
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
}

export interface BaseQuery{
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {$lte: number};
  category?: string;
}

export type invalidatesCacheProps = {
  // ? means optional.
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
}

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string ;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: number;

}

export interface NewOrderRequestBody {
  shippingInfo: {};
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges : number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}