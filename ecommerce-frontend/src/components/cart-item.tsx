import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type CartItemProps = {
  cartItem: any;
  increamentHandler : (CartItem : CartItem) => void;
  decreamentHandler : (CartItem : CartItem) => void;
  removeHandler : (id : string) => void;

};

const CartItem = ( {cartItem, increamentHandler, decreamentHandler,removeHandler}: CartItemProps) => {


  const {photo, productId, name, price, quantity} = cartItem;

  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt= {name} />
      <article>
        <Link to = {`/product/${productId}`}> {name}</Link>
        <span>₹{price}</span>
      </article>
      <div>
        <button onClick={() => decreamentHandler(cartItem)}> <FaMinus /> </button>
        <p>{quantity} </p>
        <button onClick={() => increamentHandler(cartItem)}> <FaPlus /> </button>
      </div>

      <button onClick={() => removeHandler(cartItem)}> <FaTrash /> </button>
    </div>
  )
}

export default CartItem
