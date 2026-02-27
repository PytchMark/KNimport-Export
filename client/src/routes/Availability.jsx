import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

const tabs = ['available_now', 'next_container', 'seasonal_limited'];

export default function Availability() {
  const [tab, setTab] = useState(tabs[0]);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  useEffect(() => { api.inventory().then((d) => setItems(d.items || [])); }, []);

  const filtered = useMemo(() => items.filter((x) => x.status === tab), [items, tab]);
  const add = (item) => setSelected((s) => [...s, { inventory_item_id: item.id, custom_item_name: null, quantity: 1, unit_label: item.unit_label, item_status_at_request: item.status }]);

  return (
    <div className="grid gap-4 p-4 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="text-2xl font-bold">Availability Board</h1>
        <div className="my-3 flex gap-2">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1 ${tab === t ? 'bg-emerald-500' : 'glass'}`}>{t}</button>)}</div>
        <div className="grid gap-3">{filtered.map((item) => <div key={item.id} className="glass rounded-2xl p-3"><p className="font-semibold">{item.name}</p><p className="text-xs">{item.quality_note}</p><button className="mt-2 rounded bg-emerald-500 px-3 py-1" onClick={() => add(item)}>Add to Request</button></div>)}</div>
      </div>
      <aside className="glass h-fit rounded-2xl p-3">
        <h2 className="font-semibold">Request Drawer ({selected.length})</h2>
        <div className="max-h-72 space-y-2 overflow-y-auto">{selected.map((x, i) => <div key={i} className="text-sm">Item #{i + 1} · Qty {x.quantity}</div>)}</div>
        <div className="mt-3 grid gap-2">
          <Link to="/reserve" state={{ prefillItems: selected }} className="rounded bg-emerald-500 px-3 py-2 text-center">Continue as Reserve</Link>
          <Link to="/restock" state={{ prefillItems: selected }} className="rounded bg-cyan-500 px-3 py-2 text-center">Continue as Restock</Link>
        </div>
      </aside>
    </div>
  );
}
