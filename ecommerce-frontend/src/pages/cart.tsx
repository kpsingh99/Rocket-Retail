import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import { addToCart, calculatePrice, removeCartItem, discountApplied } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { server } from "../redux/store";
import { RootState } from "../redux/store";

const Cart = () => {

  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  const [couponCode, setCouponcode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponcode] = useState<boolean>(false);
  
  const increamentHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };
  useEffect(() => {
    const source = axios.CancelToken.source();

    const timeoutId = setTimeout(() => {
      console.log(couponCode);
      axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
        cancelToken: source.token,
      }).then(
        (res) => {
          dispatch(discountApplied(res.data.discount))
          setIsValidCouponcode(true);
          dispatch(calculatePrice());
        }
      ).catch((error) => {
        if (!axios.isCancel(error)) {
          dispatch(discountApplied(0));
          setIsValidCouponcode(false);
          dispatch(calculatePrice());
        }
      });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      source.cancel();
      setIsValidCouponcode(false);
    }

  }, [couponCode, dispatch]);
  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);


  return (
    <div className="cart">
      <main>
        {cartItems.length > 0  ? (cartItems.map((i, idx) => (
          <CartItemCard 
          increamentHandler={increamentHandler} 
          decreamentHandler={decrementHandler} 
          removeHandler={removeHandler} 
          key={idx} 
          cartItem={i} 
          />
        )) 
      )
      : <h1> No items Added.</h1> }



      </main>
      <aside>
        <p> Subtotal: ₹{subtotal}</p>
        <p> Shipping Charges: ₹{shippingCharges}</p>
        <p> Tax: ₹{tax}</p>
        <p>
          Discount <em className="red"> - ₹{discount} </em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>
        <input type="text"
          placeholder="coupaon Code"
          value={couponCode}
          onChange={(e) => setCouponcode(e.target.value)}
        />
        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">₹{discount} off using the <code>{couponCode} </code> </span>)
            : (
              <span className="red">Invalid Coupon Code. <VscError /> </span>
            ))
        }


        {
          cartItems.length > 0 && <Link to ="/shipping" > Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart
