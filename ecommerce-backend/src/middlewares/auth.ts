import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js"
import { User } from "../models/user.js";

// Middleware to make sure that only admin is allowed.
export const adminOnly = TryCatch(async (req, res, next) => {
  const {id} = req.query;

  if(!id) return next(new ErrorHandler("ID not provided.", 401));

    const user = await User.findById(id);
    if(!user) return next(new ErrorHandler("ID not found.", 401))
    
    if(user.role != "admin") return next(new ErrorHandler("You are requesting for Admin, but Provided is not for admin Access", 401))
    
      // It will go to get allusers.
      next();
});

// "api/v1/user/:id"
// ? lga ke jo likhte hai woh query hoti hai.
// api/v1/user/sdfdff?=24 // key = 24