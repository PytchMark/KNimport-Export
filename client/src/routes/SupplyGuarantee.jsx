import { Link } from 'react-router-dom';

export default function SupplyGuarantee() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Supply Guarantee Program</h1>
      <p className="text-slate-300">Never run out of stock again. Reserve before shipment arrival and operate with predictable inventory confidence.</p>
      <div className="glass rounded-2xl p-4">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Priority allocation on upcoming containers</li>
          <li>• Lower rates for predictable recurring demand</li>
          <li>• Guaranteed sourcing planning for key items</li>
        </ul>
      </div>
      <Link to="/reserve" className="inline-block rounded-full bg-emerald-500 px-4 py-2">Join the Supply Program</Link>
    </div>
  );
}
