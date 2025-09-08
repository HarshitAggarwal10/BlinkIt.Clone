import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: "", type: "percent", value: 10 });

  const fetchCoupons = () => {
    api.get("/admin/coupons").then(res => setCoupons(res.data));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const createCoupon = async () => {
    await api.post("/admin/coupons", form);
    fetchCoupons();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Manage Coupons</h2>
      <div className="space-y-2 my-4">
        <input className="border p-2" placeholder="Code"
          onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <select className="border p-2" onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="percent">Percent</option>
          <option value="fixed">Fixed</option>
        </select>
        <input className="border p-2" placeholder="Value"
          onChange={(e) => setForm({ ...form, value: e.target.value })} />
        <button onClick={createCoupon} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
      </div>
      <ul>
        {coupons.map(c => (
          <li key={c._id} className="border-b p-2">
            {c.code} - {c.type} - {c.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
