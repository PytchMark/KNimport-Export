import { Link } from 'react-router-dom';

const steps = [
  { title: 'Request your produce', detail: 'Submit reserve or restock needs from the availability board or request forms.' },
  { title: 'We confirm sourcing + availability', detail: 'K&N validates supply windows, quality, and handling path.' },
  { title: 'Secure your allocation', detail: 'Finalize your reserved quantities and receive offline payment instructions.' },
  { title: 'Receive fresh shipment', detail: 'Container or urgent freight is coordinated to your required timeline.' }
];

export default function HowItWorks() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">How It Works</h1>
      <p className="text-sm text-slate-300">A predictable ordering system for wholesale businesses that need consistent Caribbean produce supply.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {steps.map((step, idx) => (
          <div key={step.title} className="glass rounded-2xl p-4">
            <p className="text-xs font-semibold text-emerald-300">STEP {idx + 1}</p>
            <h2 className="mt-1 font-semibold">{step.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{step.detail}</p>
          </div>
        ))}
      </div>
      <Link to="/reserve" className="inline-block rounded-full bg-emerald-500 px-4 py-2">Reserve Space in the Next Container</Link>
    </div>
  );
}
