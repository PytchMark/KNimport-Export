import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import MotionWall from '../components/MotionWall';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [media, setMedia] = useState([]);
  useEffect(() => { api.inventory().then((d) => setInventory(d.items || [])); api.media().then((d) => setMedia(d.assets || [])); }, []);
  const lane = (status, title) => (
    <section className="space-y-2"><h3 className="text-lg font-semibold">{title}</h3><div className="flex gap-3 overflow-x-auto pb-2">{inventory.filter((i) => i.status === status).map((item) => <div key={item.id} className="glass min-w-56 rounded-2xl p-3"><p className="font-semibold">{item.name}</p><p className="text-xs text-slate-300">{item.quality_note}</p></div>)}</div></section>
  );
  return (
    <div className="space-y-10 p-4">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-600/70 to-cyan-500/60 p-6">
        <h1 className="text-3xl font-bold">Wholesale Caribbean produce with QCM-grade consistency.</h1>
        <p className="mt-3 text-sm">Reserve container allocation or send urgent restock requests in minutes.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/reserve" className="rounded-full bg-white px-4 py-2 text-slate-900">Reserve Next Shipment</Link>
          <Link to="/restock" className="rounded-full glass px-4 py-2">Quick Restock</Link>
          <a href="https://wa.me/18760000000" className="rounded-full glass px-4 py-2">WhatsApp Fast Order</a>
        </div>
      </section>
      {lane('available_now', '✅ Available now')}
      {lane('next_container', '🧊 Coming next container')}
      {lane('seasonal_limited', '🌱 Seasonal / limited')}
      <MotionWall assets={media} />
    </div>
  );
}
