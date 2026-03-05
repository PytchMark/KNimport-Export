import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

const tabs = ['available_now', 'next_container', 'seasonal_limited'];
const labels = {
  available_now: '✅ Available Now',
  next_container: '🧊 Coming Next Container',
  seasonal_limited: '🌱 Seasonal / Limited'
};

export default function Availability() {
  const [tab, setTab] = useState(tabs[0]);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [qtyDrafts, setQtyDrafts] = useState({});

  useEffect(() => { api.inventory().then((d) => setItems(d.items || [])); }, []);

  const filtered = useMemo(() => items.filter((x) => x.status === tab), [items, tab]);

  const add = (item) => {
    const qty = Number(qtyDrafts[item.id] || 1);
    setSelected((s) => {
      const index = s.findIndex((x) => x.inventory_item_id === item.id);
      if (index > -1) {
        const copy = [...s];
        copy[index] = { ...copy[index], quantity: copy[index].quantity + qty };
        return copy;
      }
      return [...s, { inventory_item_id: item.id, custom_item_name: null, quantity: qty, unit_label: item.unit_label, item_status_at_request: item.status, substitutions_allowed: false, name: item.name }];
    });
  };

  const updateSelected = (id, key, value) => setSelected((list) => list.map((x) => (x.inventory_item_id === id ? { ...x, [key]: value } : x)));
  const removeSelected = (id) => setSelected((list) => list.filter((x) => x.inventory_item_id !== id));

  return (
    <div className="grid gap-4 p-4 md:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-2xl font-bold">Availability Board</h1>
        <p className="text-sm text-slate-300">Build your request list and send it for confirmation. No checkout.</p>
        <div className="my-3 flex flex-wrap gap-2">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1 ${tab === t ? 'bg-emerald-500' : 'glass'}`}>{labels[t]}</button>)}</div>
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((item) => (
            <div key={item.id} className="glass rounded-2xl p-3">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-slate-300">{item.quality_note || 'QCM checked for handling + shelf performance.'}</p>
              <p className="mt-1 text-xs text-slate-400">Unit: {item.unit_label || 'bulk'}</p>
              <div className="mt-2 flex items-center gap-2">
                <input type="number" min="1" value={qtyDrafts[item.id] || 1} onChange={(e) => setQtyDrafts((q) => ({ ...q, [item.id]: e.target.value }))} className="w-20 rounded bg-white/10 p-1" />
                <button className="rounded bg-emerald-500 px-3 py-1" onClick={() => add(item)}>Add to Request</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="glass h-fit rounded-2xl p-3">
        <h2 className="font-semibold">Request Drawer ({selected.length})</h2>
        <div className="mt-2 max-h-96 space-y-2 overflow-y-auto">
          {selected.map((x) => (
            <div key={x.inventory_item_id} className="rounded-xl bg-white/5 p-2 text-sm">
              <p className="font-medium">{x.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <label>Qty</label>
                <input type="number" min="1" value={x.quantity} onChange={(e) => updateSelected(x.inventory_item_id, 'quantity', Number(e.target.value || 1))} className="w-16 rounded bg-white/10 p-1" />
                <button className="text-rose-300" onClick={() => removeSelected(x.inventory_item_id)}>Remove</button>
              </div>
              <label className="mt-1 flex items-center gap-2 text-xs"><input type="checkbox" checked={x.substitutions_allowed} onChange={(e) => updateSelected(x.inventory_item_id, 'substitutions_allowed', e.target.checked)} />Substitute allowed</label>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2">
          <Link to="/reserve" state={{ prefillItems: selected }} className="rounded bg-emerald-500 px-3 py-2 text-center">Continue as Reserve</Link>
          <Link to="/restock" state={{ prefillItems: selected }} className="rounded bg-cyan-500 px-3 py-2 text-center">Continue as Restock</Link>
        </div>
      </aside>
    </div>
  );
}
