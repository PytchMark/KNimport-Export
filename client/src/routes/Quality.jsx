import { Link } from 'react-router-dom';

export default function Quality() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Quality Control (QCM)</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="glass rounded-2xl p-4"><h2 className="font-semibold">Sourcing</h2><p className="mt-1 text-sm text-slate-300">Direct Caribbean supplier relationships with quality-first lot selection.</p></div>
        <div className="glass rounded-2xl p-4"><h2 className="font-semibold">Handling</h2><p className="mt-1 text-sm text-slate-300">Fresh packing and handling procedures designed to preserve shelf life.</p></div>
        <div className="glass rounded-2xl p-4"><h2 className="font-semibold">Inspection</h2><p className="mt-1 text-sm text-slate-300">Quality checks are applied before shipment release and fulfillment confirmation.</p></div>
        <div className="glass rounded-2xl p-4"><h2 className="font-semibold">Distribution</h2><p className="mt-1 text-sm text-slate-300">Balanced allocation and routing reduce spoilage and stock volatility.</p></div>
      </div>
      <Link to="/reserve" className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-slate-950">Reserve Your Produce Supply</Link>
    </div>
  );
}
