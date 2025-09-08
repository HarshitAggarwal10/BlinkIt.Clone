import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const fetchProducts = () => {
    api.get("/products").then(res => setProducts(res.data));
  };

  useEffect(() => { fetchProducts(); }, []);

  const createProduct = async () => {
    await api.post("/admin/products", form);
    fetchProducts();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Manage Products</h2>
      <div className="space-y-2 my-4">
        <input className="border p-2" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2" placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="border p-2" placeholder="Stock"
          onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <button onClick={createProduct} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </div>
      <ul>
        {products.map(p => (
          <li key={p._id} className="border-b p-2">
            {p.name} - ₹{p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
