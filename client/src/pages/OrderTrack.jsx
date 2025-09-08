import React, { useEffect, useState } from 'react';
import useOrderSocket from '../hooks/useOrderSocket';
import api from '../api/axios';

export default function OrderTrack() {
  const [order, setOrder] = useState(null);
  const [riderLoc, setRiderLoc] = useState(null);
  const orderId = window.location.pathname.split('/').pop();

  useOrderSocket(orderId, (data) => setRiderLoc(data));

  useEffect(() => {
    api.get('/orders/' + orderId).then(res => setOrder(res.data)).catch(console.error);
  }, [orderId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order status</h2>
      {order ? (
        <div className="space-y-2">
          <div>Order: {order._id}</div>
          <div>Status: {order.status}</div>
          {riderLoc ? <div>Rider at: {riderLoc.lat}, {riderLoc.lng}</div> : <div>Rider location not available yet</div>}
        </div>
      ) : <div>Loading...</div>}
    </div>
  );
}
