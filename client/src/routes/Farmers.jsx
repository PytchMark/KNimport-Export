import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import { api } from '../api/client';

export default function Farmers() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    farm_name: '',
    contact_name: '',
    phone_whatsapp: '',
    email: '',
    parish: '',
    produce_types: '',
    farm_size: '',
    certifications: '',
    delivery_capacity: ''
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.farm_name || !form.contact_name || !form.phone_whatsapp || !form.produce_types) {
      setError('Please complete all required fields.');
      return;
    }

    setSaving(true);
    try {
      const notes = [
        `Produce: ${form.produce_types}`,
        form.farm_size ? `Farm size: ${form.farm_size}` : '',
        form.certifications ? `Certifications: ${form.certifications}` : '',
        form.delivery_capacity ? `Delivery capacity: ${form.delivery_capacity}` : ''
      ].filter(Boolean).join(' | ');

      const response = await api.createRequest({
        request_type: 'supplier_signup',
        business_name: form.farm_name,
        contact_name: form.contact_name,
        phone_whatsapp: form.phone_whatsapp,
        email: form.email,
        parish: form.parish,
        business_type: 'farmer_supplier',
        urgency: 'normal',
        substitutions_allowed: false,
        notes,
        items: []
      });

      navigate(`/thanks/${response.reference_id}`);
    } catch (submissionError) {
      setError(submissionError.message || 'Failed to submit supplier application.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">Supplier Program</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4">Farmers Sign Up</h1>
            <p className="text-zinc-400 mt-4">
              Become a vetted supplier for K&N Imports. Share your farm details and we’ll review your application in the admin portal.
            </p>
          </motion.div>

          <form onSubmit={onSubmit} className="glass-strong rounded-3xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Farm / Business Name *</label>
                <input className="input" value={form.farm_name} onChange={(e) => update('farm_name', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Contact Name *</label>
                <input className="input" value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Phone / WhatsApp *</label>
                <input className="input" placeholder="e.g. +1 876 123 4567" value={form.phone_whatsapp} onChange={(e) => update('phone_whatsapp', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input className="input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Parish / Location</label>
                <input className="input" value={form.parish} onChange={(e) => update('parish', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Farm Size</label>
                <input className="input" placeholder="e.g. 5 acres" value={form.farm_size} onChange={(e) => update('farm_size', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="input-label">Produce Types *</label>
              <textarea className="input min-h-28" placeholder="List crops/products you can supply" value={form.produce_types} onChange={(e) => update('produce_types', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Certifications</label>
                <input className="input" placeholder="e.g. GAP, organic practices" value={form.certifications} onChange={(e) => update('certifications', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Delivery Capacity</label>
                <input className="input" placeholder="e.g. weekly, own transport" value={form.delivery_capacity} onChange={(e) => update('delivery_capacity', e.target.value)} />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button disabled={saving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60" type="submit">
              <Leaf size={16} /> {saving ? 'Submitting...' : 'Submit Supplier Application'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
