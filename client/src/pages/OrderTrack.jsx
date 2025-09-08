import React, { useEffect, useState } from "react";
import useOrderSocket from "../hooks/useOrderSocket";
import api from "../api/axios";

export default function OrderTrack() {
  const [order, setOrder] = useState(null);
  const orderId = window.location.pathname.split("/").pop();

  useOrderSocket(orderId, (update) => setOrder(update));

  useEffect(() => {
    api.get("/orders/" + orderId)
      .then(res => setOrder(res.data))
      .catch(console.error);
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order Tracking</h2>
      <div>Order ID: {order._id}</div>
      <div>Status: {order.status}</div>
      {order.assignedRider && (
        <div>Rider: {order.assignedRider.name} ({order.assignedRider.phone})</div>
      )}
    </div>
  );
}
