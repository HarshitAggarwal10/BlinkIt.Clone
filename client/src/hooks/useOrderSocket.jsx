import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useOrderSocket(orderId, onRiderUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!orderId) return;
    const socket = io(
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:5000",
      { withCredentials: true }
    );

    socket.emit("order:join", orderId);

    socket.on("order:status", (data) => onRiderUpdate?.(data));
    socketRef.current = socket;

    return () => socket.disconnect();
  }, [orderId, onRiderUpdate]);

  return socketRef;
}
