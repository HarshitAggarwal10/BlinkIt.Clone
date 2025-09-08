import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { io } from "socket.io-client";

export default function RiderDashboard() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    api.get("/rider/orders").then(res => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
    const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""));
    socket.emit("rider:join", "riderRoom");
    socket.on("order:assigned", fetchOrders);
    return () => socket.disconnect();
  }, []);

  const updateStatus = async (orderId, status) => {
    await api.patch(`/rider/orders/${orderId}`, { status });
    fetchOrders();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Rider Dashboard</h2>
      <ul>
        {orders.map(o => (
          <li key={o._id} className="border-b p-2 flex justify-between">
            <div>
              {o.items.map(it => (
                <div key={it.product}>{it.name} x {it.qty}</div>
              ))}
              <div>Status: {o.status}</div>
            </div>
            <div>
              <button onClick={() => updateStatus(o._id, "out_for_delivery")}
                className="bg-yellow-600 text-white px-2 py-1 mr-2 rounded">
                Out for Delivery
              </button>
              <button onClick={() => updateStatus(o._id, "delivered")}
                className="bg-green-600 text-white px-2 py-1 rounded">
                Delivered
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
