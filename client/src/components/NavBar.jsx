import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import api from "../api/axios";

export default function NavBar() {
  const { user, setUser } = useContext(AuthContext);
  const { state } = useContext(CartContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">Blinkit Clone</Link>
      <div className="flex items-center space-x-4">
        <Link to="/products">Products</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {user?.role === "rider" && <Link to="/rider">Rider</Link>}
        <Link to="/cart">Cart ({state.items.length})</Link>
        {user ? (
          <>
            <span className="text-sm">{user.email}</span>
            <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
