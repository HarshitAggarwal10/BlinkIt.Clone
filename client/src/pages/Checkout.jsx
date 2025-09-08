import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { state, dispatch } = useContext(CartContext);
  const [address, setAddress] = useState({ label: "Home", line1: "", city: "", pincode: "" });
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  const submit = async () => {
    try {
      const items = state.items.map(i => ({
        product: i.product,
        name: i.name,
        qty: i.qty,
        price: i.price
      }));
      const res = await api.post("/orders", { items, address, couponCode });
      dispatch({ type: "CLEAR" });
      alert("Order placed");
      navigate("/order/" + res.data._id);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded mt-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <div className="space-y-2">
        <input className="w-full border p-2" placeholder="Address line"
          value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} />
        <input className="w-full border p-2" placeholder="City"
          value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
        <input className="w-full border p-2" placeholder="Pincode"
          value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
        <input className="w-full border p-2" placeholder="Coupon Code"
          value={couponCode} onChange={e => setCouponCode(e.target.value)} />
        <div className="mt-2 font-bold">Subtotal: ₹{subtotal}</div>
        <button
          onClick={submit}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
