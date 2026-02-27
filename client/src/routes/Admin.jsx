import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { supabase } from '../lib/supabase';

const statuses = ['new', 'contacted', 'quoted', 'confirmed', 'fulfilled', 'archived'];

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const login = async () => {
    if (!supabase) return setMsg('Missing Supabase client env.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    localStorage.setItem('admin_token', data.session.access_token);
    window.location.href = '/admin/dashboard';
  };

  return <div className="mx-auto mt-20 max-w-md space-y-3 p-4 glass rounded-3xl"><h1 className="text-xl font-semibold">Admin Login</h1><input className="w-full rounded bg-white/10 p-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><input type="password" className="w-full rounded bg-white/10 p-2" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><button className="rounded bg-emerald-500 px-3 py-2" onClick={login}>Sign in</button><p className="text-sm text-rose-300">{msg}</p></div>;
}

export function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [inventoryName, setInventoryName] = useState('');
  const token = localStorage.getItem('admin_token');
  const load = () => api.adminRequests(token).then((d) => setRequests(d.requests || []));
  useEffect(() => { if (token) load(); }, [token]);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <section className="grid gap-3 md:grid-cols-3">{statuses.map((s) => <div key={s} className="glass rounded-2xl p-3"><p className="mb-2 font-semibold uppercase">{s}</p>{requests.filter((r) => r.status === s).map((r) => <button key={r.id} className="mb-1 block w-full rounded bg-white/10 p-2 text-left" onClick={() => api.updateRequest(r.id, { status: statuses[Math.min(statuses.indexOf(r.status) + 1, statuses.length - 1)] }, token).then(load)}>{r.reference_id} · {r.business_name}</button>)}</div>)}</section>
      <section className="glass rounded-2xl p-3">
        <h2 className="font-semibold">Quick inventory create</h2>
        <div className="mt-2 flex gap-2"><input className="rounded bg-white/10 p-2" placeholder="Item name" onChange={(e) => setInventoryName(e.target.value)} /><button className="rounded bg-cyan-500 px-3" onClick={() => api.createInventory({ name: inventoryName, status: 'available_now', unit_label: 'per box' }, token)}>Add</button></div>
      </section>
    </div>
  );
}
