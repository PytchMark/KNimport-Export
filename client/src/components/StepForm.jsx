import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Package, ChevronRight, ChevronLeft } from 'lucide-react';

const stepTitles = {
  reserve: ['Select Produce', 'Business Details', 'Delivery Preferences', 'Review & Submit'],
  restock: ['Request Details', 'Business Info', 'Review & Submit']
};

export default function StepForm({ type = 'reserve', initialItems = [] }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    phone_whatsapp: '',
    email: '',
    parish: '',
    business_type: '',
    notes: '',
    substitutions_allowed: true,
    urgency: type === 'restock' ? 'asap' : '3_7_days',
    guarantee_allocation: false,
    needed_by: '',
    produce_needed: '',
    quantity_text: '',
    items: initialItems
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (type === 'reserve') {
      api.inventory('next_container').then((d) => setInventory(d.items || []));
    }
  }, [type]);

  const maxStep = type === 'reserve' ? 4 : 3;
  const titles = stepTitles[type];
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
            item_status_at_request: item.status,
            name: item.name
          }]
        };
      }
      return current;
    });
  };

  const updateItem = (id, key, value) => {
    setForm((current) => ({ 
      ...current, 
      items: current.items.map((x) => (x.inventory_item_id === id ? { ...x, [key]: value } : x)) 
    }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      const detailNotes = [
        type === 'restock' ? `Produce needed: ${form.produce_needed}. Quantity: ${form.quantity_text}.` : '',
        form.notes,
        type === 'reserve' ? `Supply Guarantee: ${form.guarantee_allocation ? 'yes' : 'no'}.` : '',
        type === 'restock' && form.needed_by ? `Needed by: ${form.needed_by}.` : ''
      ].filter(Boolean).join(' | ');
      
      const payloadItems = selectedItems.map(({ substitutions_allowed, name, ...item }) => item);
      const res = await api.createRequest({ 
        ...form, 
        notes: detailNotes, 
        request_type: type, 
        items: payloadItems 
      });
      navigate(`/thanks/${res.reference_id}`);
    } catch (err) {
      alert('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (type === 'reserve' && step === 1) return selectedItems.length > 0;
    if ((type === 'reserve' && step === 2) || (type === 'restock' && step === 1)) {
      return form.business_name && form.contact_name && form.phone_whatsapp;
    }
    return true;
  };

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Progress Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Step {step} of {maxStep}
          </span>
          <span className="text-sm text-zinc-400">{titles[step - 1]}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2">
          {Array.from({ length: maxStep }).map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 flex-1 rounded-full transition-colors ${
                idx < step ? 'bg-primary' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto text-primary mb-3" size={32} />
              <p className="text-zinc-400">Submitting your request...</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* RESERVE Step 1: Select Produce */}
          {type === 'reserve' && step === 1 && (
            <motion.div
              key="reserve-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-zinc-400 text-sm mb-6">
                Select produce from the upcoming container and set quantities.
              </p>
              
              {inventory.length > 0 ? inventory.map((item) => {
                const selected = form.items.find((x) => x.inventory_item_id === item.id);
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                      selected 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => toggleReserveItem(item, !selected)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selected ? 'bg-primary border-primary' : 'border-zinc-600'
                        }`}>
                          {selected && <Check size={14} className="text-black" />}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-zinc-500">{item.unit_label || 'per unit'}</p>
                        </div>
                      </div>
                      
                      {selected && (
                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="number" 
                            min="1" 
                            value={selected.quantity} 
                            onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                            className="w-20 input text-center !py-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-12">
                  <Package className="mx-auto text-zinc-600 mb-3" size={40} />
                  <p className="text-zinc-500">No items available for next container yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* RESTOCK Step 1 / RESERVE Step 2: Business Details */}
          {((type === 'reserve' && step === 2) || (type === 'restock' && step === 1)) && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {type === 'restock' && (
                <>
                  <div>
                    <label className="input-label">What produce do you need?</label>
                    <input 
                      className="input" 
                      placeholder="e.g., Jamaican Yams, Plantains, Scotch Bonnet"
                      value={form.produce_needed}
                      onChange={(e) => update('produce_needed', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">Quantity Needed</label>
                    <input 
                      className="input" 
                      placeholder="e.g., 50 boxes, 200 lbs"
                      value={form.quantity_text}
                      onChange={(e) => update('quantity_text', e.target.value)}
                    />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="input-label">Business Name *</label>
                  <input 
                    className="input" 
                    placeholder="Your business name"
                    value={form.business_name}
                    onChange={(e) => update('business_name', e.target.value)}
                    data-testid="input-business-name"
                  />
                </div>
                <div>
                  <label className="input-label">Contact Name *</label>
                  <input 
                    className="input" 
                    placeholder="Your full name"
                    value={form.contact_name}
                    onChange={(e) => update('contact_name', e.target.value)}
                    data-testid="input-contact-name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="input-label">Phone / WhatsApp *</label>
                  <input 
                    className="input" 
                    placeholder="+1 (876) 000-0000"
                    value={form.phone_whatsapp}
                    onChange={(e) => update('phone_whatsapp', e.target.value)}
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input 
                    className="input" 
                    type="email"
                    placeholder="email@business.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="input-label">Location / Parish</label>
                  <input 
                    className="input" 
                    placeholder="Kingston, St. Andrew, etc."
                    value={form.parish}
                    onChange={(e) => update('parish', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Business Type</label>
                  <select 
                    className="input"
                    value={form.business_type}
                    onChange={(e) => update('business_type', e.target.value)}
                  >
                    <option value="">Select type...</option>
                    <option value="retailer">Retailer</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="vendor">Vendor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timing/Preferences Step */}
          {((type === 'reserve' && step === 3) || (type === 'restock' && step === 2)) && (
            <motion.div
              key="timing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="input-label">Urgency Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {[
                    { value: 'asap', label: 'ASAP' },
                    { value: '1_2_days', label: '1-2 Days' },
                    { value: '3_7_days', label: '3-7 Days' },
                    { value: 'not_urgent', label: 'Not Urgent' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('urgency', opt.value)}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                        form.urgency === opt.value 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {type === 'reserve' && (
                <div 
                  className={`p-5 rounded-xl border cursor-pointer transition-colors ${
                    form.guarantee_allocation 
                      ? 'bg-secondary/10 border-secondary/30' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => update('guarantee_allocation', !form.guarantee_allocation)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      form.guarantee_allocation ? 'bg-secondary border-secondary' : 'border-zinc-600'
                    }`}>
                      {form.guarantee_allocation && <Check size={14} className="text-white" />}
                    </div>
                    <div>
                      <p className="font-medium">Join Supply Guarantee Program</p>
                      <p className="text-sm text-zinc-400">Priority allocation, lower rates, guaranteed sourcing</p>
                    </div>
                  </div>
                </div>
              )}

              {type === 'restock' && (
                <div>
                  <label className="input-label">Preferred Delivery Date</label>
                  <input 
                    type="date" 
                    className="input"
                    value={form.needed_by}
                    onChange={(e) => update('needed_by', e.target.value)}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Review Step */}
          {((type === 'reserve' && step === 4) || (type === 'restock' && step === 3)) && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="input-label">Additional Notes</label>
                <textarea 
                  className="input min-h-[100px]" 
                  placeholder="Special sourcing requests, handling instructions, or notes..."
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                />
              </div>

              <div className="bg-white/5 rounded-xl p-5 space-y-4">
                <h4 className="font-semibold">Request Summary</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Business:</span>
                    <span>{form.business_name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Contact:</span>
                    <span>{form.contact_name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Phone:</span>
                    <span>{form.phone_whatsapp || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Urgency:</span>
                    <span className="capitalize">{form.urgency.replace('_', '-')}</span>
                  </div>
                </div>

                {selectedItems.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Items ({selectedItems.length})</p>
                    {selectedItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span>{item.name}</span>
                        <span className="text-zinc-400">× {item.quantity} {item.unit_label || ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 border-t border-white/5 flex justify-between">
        <button 
          className="btn-ghost flex items-center gap-2"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ChevronLeft size={18} /> Back
        </button>
        
        {step < maxStep ? (
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            data-testid="form-next-btn"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={submit}
            disabled={loading || !canProceed()}
            data-testid="form-submit-btn"
          >
            {type === 'reserve' ? 'Submit Reservation' : 'Send Request'} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
