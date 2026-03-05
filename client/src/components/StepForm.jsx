import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function StepForm({ type = 'reserve', initialItems = [] }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [itemDrafts, setItemDrafts] = useState({});
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    phone_whatsapp: '',
    email: '',
    parish: '',
    notes: '',
    substitutions_allowed: true,
    urgency: type === 'restock' ? 'asap' : '1_2_days',
    guarantee_allocation: false,
    needed_by: '',
    items: initialItems
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (type === 'reserve') api.inventory('next_container').then((d) => setInventory(d.items || []));
  }, [type]);

  const maxStep = type === 'reserve' ? 4 : 3;
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const selectedItems = useMemo(() => form.items.filter((item) => Number(item.quantity) > 0), [form.items]);

  const toggleReserveItem = (item, checked) => {
    setForm((current) => {
      const existing = current.items.find((x) => x.inventory_item_id === item.id);
      if (!checked && existing) return { ...current, items: current.items.filter((x) => x.inventory_item_id !== item.id) };
      if (checked && !existing) {
        return {
          ...current,
          items: [...current.items, {
            inventory_item_id: item.id,
            custom_item_name: null,
            quantity: 1,
            unit_label: item.unit_label,
            item_status_at_request: item.status
          }]
        };
      }
      return current;
    });
  };

  const updateItem = (id, key, value) => {
    setForm((current) => ({ ...current, items: current.items.map((x) => (x.inventory_item_id === id ? { ...x, [key]: value } : x)) }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      const detailNotes = [
        form.notes,
        type === 'reserve' ? `Join Supply Guarantee Program: ${form.guarantee_allocation ? 'yes' : 'no'}.` : '',
        type === 'restock' && form.needed_by ? `Preferred delivery date: ${form.needed_by}.` : ''
      ].filter(Boolean).join(' | ');
      const payloadItems = selectedItems.map(({ substitute_allowed, name, ...item }) => item);
      const res = await api.createRequest({ ...form, notes: detailNotes, request_type: type, items: payloadItems });
      navigate(`/thanks/${res.reference_id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative glass rounded-3xl p-4">
      {loading && <div className="absolute inset-0 grid place-items-center rounded-3xl bg-slate-950/90">Please wait…</div>}
      <p className="mb-2 text-sm text-emerald-300">Step {step} of {maxStep}</p>

      {type === 'reserve' && step === 1 && (
        <div className="space-y-2">
          <p className="text-sm text-slate-300">Select produce and set quantity/substitute preference.</p>
          {inventory.map((item) => {
            const selected = form.items.find((x) => x.inventory_item_id === item.id);
            return (
              <div key={item.id} className="rounded-xl bg-white/5 p-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!selected} onChange={(e) => toggleReserveItem(item, e.target.checked)} />
                  <span className="font-medium">{item.name}</span>
                </label>
                {selected && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <input type="number" min="1" value={selected.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value || 1))} className="w-20 rounded bg-white/10 p-1" />
                    <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!itemDrafts[item.id]} onChange={(e) => setItemDrafts((d) => ({ ...d, [item.id]: e.target.checked }))} />Substitute allowed</label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {((type === 'reserve' && step === 2) || (type === 'restock' && step === 1)) && (
        <div className="grid gap-2">
          {type === 'restock' && <input className="rounded bg-white/10 p-2" placeholder="Produce needed" onChange={(e) => update('notes', `Produce needed: ${e.target.value}`)} />}
          {type === 'restock' && <input className="rounded bg-white/10 p-2" placeholder="Quantity" onChange={(e) => update('notes', `${form.notes} | Quantity: ${e.target.value}`)} />}
          <input className="rounded bg-white/10 p-2" placeholder="Business Name" onChange={(e) => update('business_name', e.target.value)} />
          <input className="rounded bg-white/10 p-2" placeholder="Contact Name" onChange={(e) => update('contact_name', e.target.value)} />
          <input className="rounded bg-white/10 p-2" placeholder="Phone / WhatsApp" onChange={(e) => update('phone_whatsapp', e.target.value)} />
          <input className="rounded bg-white/10 p-2" placeholder="Email" onChange={(e) => update('email', e.target.value)} />
          <input className="rounded bg-white/10 p-2" placeholder="Location" onChange={(e) => update('parish', e.target.value)} />
        </div>
      )}

      {((type === 'reserve' && step === 3) || (type === 'restock' && step === 2)) && (
        <div className="grid gap-2">
          <select className="rounded bg-white/10 p-2" value={form.urgency} onChange={(e) => update('urgency', e.target.value)}>
            <option value="asap">ASAP</option>
            <option value="1_2_days">1-2 Days</option>
            <option value="3_7_days">3-7 Days</option>
            <option value="not_urgent">Not urgent</option>
          </select>
          {type === 'reserve' && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.guarantee_allocation} onChange={(e) => update('guarantee_allocation', e.target.checked)} />Join Supply Guarantee Program</label>}
          {type === 'restock' && <input className="rounded bg-white/10 p-2" placeholder="Preferred Delivery Date" onChange={(e) => update('needed_by', e.target.value)} />}
        </div>
      )}

      {((type === 'reserve' && step === 4) || (type === 'restock' && step === 3)) && (
        <div className="grid gap-2">
          <textarea className="rounded bg-white/10 p-2" placeholder="Special sourcing requests / Notes" onChange={(e) => update('notes', `${form.notes} | ${e.target.value}`)} />
          <div className="rounded-xl bg-white/5 p-2 text-sm">
            <p className="font-medium">Selected items: {selectedItems.length}</p>
            {selectedItems.map((item, idx) => <p key={idx}>• Qty {item.quantity} {item.unit_label || ''}</p>)}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button className="rounded bg-white/20 px-3 py-2" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
        {step < maxStep
          ? <button className="rounded bg-emerald-500 px-3 py-2 text-slate-950" onClick={() => setStep((s) => s + 1)}>Next</button>
          : <button className="rounded bg-emerald-500 px-3 py-2 text-slate-950" onClick={submit}>{type === 'reserve' ? 'Submit Reservation Request' : 'Send Restock Request'}</button>}
      </div>
    </div>
  );
}
