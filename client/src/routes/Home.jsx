import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import MotionWall from '../components/MotionWall';

const trust = ['Authentic Caribbean Produce', 'Quality Control Managed', 'Reliable Supply Partner', 'Wholesale Distribution'];
const steps = ['Request your produce', 'We confirm sourcing + availability', 'Secure your allocation', 'Receive fresh shipment'];

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    api.inventory().then((d) => setInventory(d.items || []));
    api.media().then((d) => setMedia(d.assets || []));
  }, []);

  const sampleItems = useMemo(() => inventory.slice(0, 3), [inventory]);

  return (
    <div className="space-y-8 p-4">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-600/70 via-emerald-500/50 to-cyan-500/50 p-6">
        <h1 className="text-3xl font-bold">Fresh Caribbean Produce.<br />Quality Controlled. Wholesale Ready.</h1>
        <p className="mt-3 max-w-3xl text-sm text-emerald-50">Reliable shipments of authentic Caribbean fruits, vegetables, herbs, and specialty foods — sourced with strict Quality Control Management (QCM).</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/reserve" className="rounded-full bg-white px-4 py-2 text-slate-900">Reserve Next Shipment</Link>
          <Link to="/restock" className="rounded-full border border-white/30 px-4 py-2">Quick Restock Request</Link>
          <a href="https://wa.me/18760000000" className="rounded-full border border-white/30 px-4 py-2">WhatsApp Fast Order</a>
        </div>
      </section>

      <section className="grid gap-2 rounded-2xl glass p-3 text-sm md:grid-cols-4">
        {trust.map((item) => <p key={item} className="text-center">{item}</p>)}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Proof of Supply. Proof of Quality.</h2>
        <MotionWall assets={media} />
        <Link to="/reserve" className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-slate-950">Reserve Your Next Shipment</Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">How It Works</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step} className="glass rounded-2xl p-3 text-sm">
              <p className="text-xs font-semibold text-emerald-300">STEP {idx + 1}</p>
              <p className="mt-1">{step}</p>
            </div>
          ))}
        </div>
        <Link to="/reserve" className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-slate-950">Reserve Space in the Next Container</Link>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold">Availability Board</h2>
          <Link to="/availability" className="text-sm text-emerald-300">View All Availability →</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {sampleItems.map((item) => (
            <div key={item.id} className="glass rounded-2xl p-3">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-300">Status: {item.status}</p>
              <p className="text-sm text-slate-300">Quality: {item.quality_note || 'QCM Verified'}</p>
              <Link to="/availability" className="mt-2 inline-block rounded bg-emerald-500 px-3 py-1 text-sm text-slate-950">Request Quantity</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-4">
        <h2 className="text-xl font-bold">Never Run Out of Stock Again</h2>
        <p className="mt-2 text-sm text-slate-300">Businesses that reserve produce before shipment arrival receive priority allocation, lower rates, and guaranteed sourcing.</p>
        <Link to="/supply-guarantee" className="mt-3 inline-block rounded-full bg-emerald-500 px-4 py-2 text-slate-950">Join the Supply Program</Link>
      </section>

      <section className="glass rounded-2xl p-4">
        <h2 className="text-xl font-bold">Quality Control (QCM)</h2>
        <p className="mt-2 text-sm text-slate-300">Inspected sourcing, careful packing, spoilage prevention, and strict freshness standards.</p>
        <Link to="/quality" className="mt-3 inline-block rounded-full bg-emerald-500 px-4 py-2 text-slate-950">See Our Quality Standards</Link>
      </section>

      <section className="rounded-2xl bg-slate-900/80 p-6 text-center">
        <h2 className="text-2xl font-bold">Secure Your Produce Supply Today</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link to="/reserve" className="rounded-full bg-emerald-500 px-4 py-2 text-slate-950">Reserve Shipment</Link>
          <Link to="/restock" className="rounded-full border border-white/30 px-4 py-2">Quick Restock</Link>
          <a href="https://wa.me/18760000000" className="rounded-full border border-white/30 px-4 py-2">WhatsApp</a>
        </div>
      </section>
    </div>
  );
}
