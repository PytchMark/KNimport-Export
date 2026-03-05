import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { supabase } from '../lib/supabase';

const statuses = ['new', 'contacted', 'quoted', 'confirmed', 'fulfilled', 'archived'];
const sidebar = ['Dashboard', 'Requests', 'Inventory', 'Businesses', 'Media', 'Settings'];

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

  return <div className="mx-auto mt-20 max-w-md space-y-3 rounded-3xl p-4 glass"><h1 className="text-xl font-semibold">Admin Login</h1><input className="w-full rounded bg-white/10 p-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><input type="password" className="w-full rounded bg-white/10 p-2" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><button className="rounded bg-emerald-500 px-3 py-2 text-slate-950" onClick={login}>Sign in</button><p className="text-sm text-rose-300">{msg}</p></div>;
}

export function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [inventoryName, setInventoryName] = useState('');
  const token = localStorage.getItem('admin_token');
  const load = () => api.adminRequests(token).then((d) => setRequests(d.requests || []));

  useEffect(() => { if (token) load(); }, [token]);

  const counts = useMemo(() => ({
    new: requests.filter((r) => r.status === 'new').length,
    quoted: requests.filter((r) => r.status === 'quoted').length,
    confirmed: requests.filter((r) => r.status === 'confirmed').length,
    fulfilled: requests.filter((r) => r.status === 'fulfilled').length
  }), [requests]);

  return (
    <div className="grid gap-4 p-4 md:grid-cols-[220px_1fr]">
      <aside className="glass h-fit rounded-2xl p-3">
        {sidebar.map((item) => <p key={item} className="mb-2 text-sm">{item}</p>)}
      </aside>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="glass rounded-2xl p-3 text-sm"><p>New Requests</p><p className="text-xl font-bold">{counts.new}</p></div>
          <div className="glass rounded-2xl p-3 text-sm"><p>Pending Quotes</p><p className="text-xl font-bold">{counts.quoted}</p></div>
          <div className="glass rounded-2xl p-3 text-sm"><p>Confirmed Orders</p><p className="text-xl font-bold">{counts.confirmed}</p></div>
          <div className="glass rounded-2xl p-3 text-sm"><p>Fulfilled Orders</p><p className="text-xl font-bold">{counts.fulfilled}</p></div>
        </div>
        <p className="text-sm text-slate-300">Requests Pipeline: New → Contacted → Quoted → Confirmed → Fulfilled → Archived</p>
        <section className="grid gap-3 md:grid-cols-3">
          {statuses.map((s) => (
            <div key={s} className="glass rounded-2xl p-3">
              <p className="mb-2 font-semibold uppercase">{s} ({requests.filter((r) => r.status === s).length})</p>
              {requests.filter((r) => r.status === s).map((r) => (
                <button key={r.id} className="mb-2 block w-full rounded bg-white/10 p-2 text-left text-sm" onClick={() => api.updateRequest(r.id, { status: statuses[Math.min(statuses.indexOf(r.status) + 1, statuses.length - 1)] }, token).then(load)}>
                  <p className="font-medium">{r.business_name}</p>
                  <p className="text-xs text-slate-400">{r.reference_id} · {r.request_type} · urgency {r.urgency || 'n/a'}</p>
                </button>
              ))}
            </div>
          ))}
        </section>
        <section className="glass rounded-2xl p-3">
          <h2 className="font-semibold">Inventory Manager (Quick Add)</h2>
          <div className="mt-2 flex gap-2"><input className="rounded bg-white/10 p-2" placeholder="Item name" onChange={(e) => setInventoryName(e.target.value)} /><button className="rounded bg-cyan-500 px-3" onClick={() => api.createInventory({ name: inventoryName, status: 'available_now', unit_label: 'per box' }, token)}>Add Item</button></div>
        </section>
      </main>
    </div>
  );
}
