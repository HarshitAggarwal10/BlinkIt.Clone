import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);

  const fetchOrders = () => {
    api.get("/admin/orders").then((res) => setOrders(res.data));
  };

  const fetchRiders = () => {
    api.get("/admin/riders").then((res) => setRiders(res.data));
  };

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  const assignRider = async (orderId, riderId) => {
    try {
      await api.post(`/admin/orders/${orderId}/assign`, { riderId });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to assign rider");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white p-3 rounded shadow">
            <div className="font-semibold mb-2">
              Order #{o._id} - {o.status}
            </div>
            <div className="mb-2">
              {o.items.map((it) => (
                <div key={it.product}>
                  {it.name} x {it.qty}
                </div>
              ))}
            </div>
            <div className="mb-2">
              <strong>Total:</strong> ₹{o.total}
            </div>
            <div className="mb-2">
              <strong>Address:</strong> {o.address.line1}, {o.address.city} -{" "}
              {o.address.pincode}
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="border p-2"
                value={o.assignedRider?._id || ""}
                onChange={(e) => assignRider(o._id, e.target.value)}
              >
                <option value="">Assign Rider</option>
                {riders.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
