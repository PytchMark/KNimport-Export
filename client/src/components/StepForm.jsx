import { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function StepForm({ type = 'reserve', initialItems = [] }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ business_name: '', contact_name: '', phone_whatsapp: '', email: '', notes: '', substitutions_allowed: true, urgency: '1_2_days', items: initialItems });
  const navigate = useNavigate();
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      const res = await api.createRequest({ ...form, request_type: type });
      navigate(`/thanks/${res.reference_id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative glass rounded-3xl p-4">
      {loading && <div className="absolute inset-0 grid place-items-center rounded-3xl bg-slate-950/90">Please wait…</div>}
      <p className="mb-2 text-sm text-emerald-300">Step {step} of 3</p>
      {step === 1 && <div className="grid gap-2"><input className="rounded bg-white/10 p-2" placeholder="Business name" onChange={(e) => update('business_name', e.target.value)} /><input className="rounded bg-white/10 p-2" placeholder="Contact name" onChange={(e) => update('contact_name', e.target.value)} /></div>}
      {step === 2 && <div className="grid gap-2"><input className="rounded bg-white/10 p-2" placeholder="WhatsApp" onChange={(e) => update('phone_whatsapp', e.target.value)} /><input className="rounded bg-white/10 p-2" placeholder="Email" onChange={(e) => update('email', e.target.value)} /><select className="rounded bg-white/10 p-2" onChange={(e) => update('urgency', e.target.value)}><option value="asap">ASAP</option><option value="1_2_days">1-2 Days</option><option value="3_7_days">3-7 Days</option><option value="not_urgent">Not urgent</option></select></div>}
      {step === 3 && <div className="grid gap-2"><textarea className="rounded bg-white/10 p-2" placeholder="Notes" onChange={(e) => update('notes', e.target.value)} /><label className="flex items-center gap-2"><input type="checkbox" checked={form.substitutions_allowed} onChange={(e) => update('substitutions_allowed', e.target.checked)} />Substitutions allowed</label></div>}
      <div className="mt-4 flex justify-between">
        <button className="rounded bg-white/20 px-3 py-2" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
        {step < 3 ? <button className="rounded bg-emerald-500 px-3 py-2" onClick={() => setStep((s) => s + 1)}>Next</button> : <button className="rounded bg-emerald-500 px-3 py-2" onClick={submit}>Submit request</button>}
      </div>
    </div>
  );
}
