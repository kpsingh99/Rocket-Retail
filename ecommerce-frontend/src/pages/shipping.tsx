import { ChangeEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cartReducerInitialState } from "../types/reducer-types";
const Shipping = () => {

  const { cartItems } = useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer);

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const navigate = useNavigate();

  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>

  ) => {
    setShippingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  },[cartItems])

  

  return (
    <div className="shipping" >
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form action="">
        <h1>Shipping Address</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select name="country" required value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country.</option>
          <option value="india">India</option>
          <option value="us">India</option>
          <option value="uk">India</option>

        </select>

        <input
          required
          type="text"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type="submit">
          Pay Now.
        </button>
      </form>
    </div >
  )
}

export default Shipping
