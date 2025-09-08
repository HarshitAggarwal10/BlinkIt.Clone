import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      alert('Registered — please login');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded mt-8">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input className="w-full border p-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full border p-2" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
