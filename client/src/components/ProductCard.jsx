import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export default function ProductCard({ p }) {
  const { dispatch } = useContext(CartContext);

  return (
    <div className="border p-3 rounded bg-white">
      <img
        src={p.images?.[0] || "https://via.placeholder.com/300x200?text=Product"}
        alt={p.name}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="font-semibold mt-2">{p.name}</h3>
      <p className="text-sm truncate">{p.description}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-bold">₹{p.price}</span>
        <button
          onClick={() =>
            dispatch({
              type: "ADD",
              payload: { product: p._id, name: p.name, price: p.price, qty: 1 },
            })
          }
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}
