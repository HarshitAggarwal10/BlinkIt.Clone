import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="space-x-4">
        <Link to="/admin/products" className="bg-blue-600 text-white px-4 py-2 rounded">Products</Link>
        <Link to="/admin/coupons" className="bg-green-600 text-white px-4 py-2 rounded">Coupons</Link>
        <Link to="/admin/orders" className="bg-yellow-600 text-white px-4 py-2 rounded">Orders</Link>
      </div>
    </div>
  );
}
