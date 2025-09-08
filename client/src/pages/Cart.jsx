import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { state, dispatch } = useContext(CartContext);
  const navigate = useNavigate();
  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      <div className="space-y-3">
        {state.items.map(it => (
          <div key={it.product} className="flex items-center justify-between bg-white p-3 rounded">
            <div>
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm">Qty: {it.qty}</div>
            </div>
            <div className="text-right">
              <div>₹{it.price * it.qty}</div>
              <button
                onClick={() => dispatch({ type: "REMOVE", payload: it.product })}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="font-bold">Subtotal: ₹{subtotal}</div>
        <button
          onClick={() => navigate("/checkout")}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
