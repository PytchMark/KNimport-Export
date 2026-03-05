import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { Link } from 'react-router-dom';
import { Plus, Minus, X, ArrowRight, Check, Package } from 'lucide-react';

const tabs = [
  { key: 'available_now', label: 'Available Now', badge: 'badge-available' },
  { key: 'next_container', label: 'Coming Next Container', badge: 'badge-coming' },
  { key: 'seasonal_limited', label: 'Seasonal / Limited', badge: 'badge-limited' }
];

export default function Availability() {
  const [tab, setTab] = useState('available_now');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [qtyDrafts, setQtyDrafts] = useState({});

  useEffect(() => { 
    api.inventory().then((d) => setItems(d.items || [])); 
  }, []);

  const filtered = useMemo(() => items.filter((x) => x.status === tab), [items, tab]);
  const statusCounts = useMemo(() => ({
    available_now: items.filter(x => x.status === 'available_now').length,
    next_container: items.filter(x => x.status === 'next_container').length,
    seasonal_limited: items.filter(x => x.status === 'seasonal_limited').length
  }), [items]);

  const add = (item) => {
    const qty = Number(qtyDrafts[item.id] || 1);
    setSelected((s) => {
      const index = s.findIndex((x) => x.inventory_item_id === item.id);
      if (index > -1) {
        const copy = [...s];
        copy[index] = { ...copy[index], quantity: copy[index].quantity + qty };
        return copy;
      }
      return [...s, { 
        inventory_item_id: item.id, 
        custom_item_name: null, 
        quantity: qty, 
        unit_label: item.unit_label, 
        item_status_at_request: item.status, 
        substitutions_allowed: false, 
        name: item.name 
      }];
    });
    setQtyDrafts((q) => ({ ...q, [item.id]: 1 }));
  };

  const updateSelected = (id, key, value) => setSelected((list) => 
    list.map((x) => (x.inventory_item_id === id ? { ...x, [key]: value } : x))
  );
  const removeSelected = (id) => setSelected((list) => list.filter((x) => x.inventory_item_id !== id));

  const totalItems = selected.reduce((acc, x) => acc + x.quantity, 0);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Inventory</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Availability Board</h1>
          <p className="text-zinc-400 mt-4 max-w-2xl">
            Build your request list and send it for confirmation. No checkout, no payment required upfront.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
          {/* Main Content */}
          <div>
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-8">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                    tab === t.key 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'bg-white/5 text-zinc-400 border border-transparent hover:border-white/10'
                  }`}
                  data-testid={`tab-${t.key}`}
                >
                  <span>{t.label}</span>
                  <span className={`${t.badge} !py-0.5 !px-2`}>{statusCounts[t.key]}</span>
                </button>
              ))}
            </div>

            {/* Inventory Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.length > 0 ? filtered.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="card-interactive"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <span className={
                        item.status === 'available_now' ? 'badge-available' :
                        item.status === 'next_container' ? 'badge-coming' : 'badge-limited'
                      }>
                        {item.status === 'available_now' ? 'Available' :
                         item.status === 'next_container' ? 'Coming Soon' : 'Limited'}
                      </span>
                    </div>
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  
                  <p className="text-sm text-zinc-400 mb-4">
                    {item.quality_note || 'QCM checked for handling + shelf performance.'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-zinc-500 font-mono uppercase">
                      {item.unit_label || 'Per Unit'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white/5 rounded-lg overflow-hidden">
                        <button 
                          className="p-2 hover:bg-white/10 transition-colors"
                          onClick={() => setQtyDrafts((q) => ({ ...q, [item.id]: Math.max(1, (q[item.id] || 1) - 1) }))}
                        >
                          <Minus size={16} />
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          value={qtyDrafts[item.id] || 1} 
                          onChange={(e) => setQtyDrafts((q) => ({ ...q, [item.id]: Math.max(1, Number(e.target.value)) }))}
                          className="w-12 bg-transparent text-center text-sm focus:outline-none"
                        />
                        <button 
                          className="p-2 hover:bg-white/10 transition-colors"
                          onClick={() => setQtyDrafts((q) => ({ ...q, [item.id]: (q[item.id] || 1) + 1 }))}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        className="btn-primary !py-2 !px-4 text-xs"
                        onClick={() => add(item)}
                        data-testid={`add-item-${item.id}`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-2 glass-strong rounded-2xl p-12 text-center">
                  <Package className="mx-auto text-zinc-600 mb-4" size={48} />
                  <p className="text-zinc-400">No items in this category yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Request Drawer */}
          <div className="xl:sticky xl:top-24 h-fit">
            <motion.div 
              className="glass-strong rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold font-serif">Request List</h2>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {selected.length} items
                  </span>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {selected.length > 0 ? selected.map((x) => (
                  <div key={x.inventory_item_id} className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{x.name}</p>
                        <p className="text-xs text-zinc-500 font-mono uppercase">{x.unit_label || 'unit'}</p>
                      </div>
                      <button 
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                        onClick={() => removeSelected(x.inventory_item_id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-white/5 rounded-lg overflow-hidden">
                        <button 
                          className="p-1.5 hover:bg-white/10"
                          onClick={() => updateSelected(x.inventory_item_id, 'quantity', Math.max(1, x.quantity - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          value={x.quantity} 
                          onChange={(e) => updateSelected(x.inventory_item_id, 'quantity', Math.max(1, Number(e.target.value)))}
                          className="w-10 bg-transparent text-center text-sm focus:outline-none"
                        />
                        <button 
                          className="p-1.5 hover:bg-white/10"
                          onClick={() => updateSelected(x.inventory_item_id, 'quantity', x.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          x.substitutions_allowed ? 'bg-primary border-primary' : 'border-zinc-600'
                        }`}>
                          {x.substitutions_allowed && <Check size={12} className="text-black" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          checked={x.substitutions_allowed} 
                          onChange={(e) => updateSelected(x.inventory_item_id, 'substitutions_allowed', e.target.checked)} 
                        />
                        Allow substitutes
                      </label>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center">
                    <Package className="mx-auto text-zinc-600 mb-3" size={32} />
                    <p className="text-zinc-500 text-sm">Your request list is empty</p>
                    <p className="text-zinc-600 text-xs mt-1">Add items from the board</p>
                  </div>
                )}
              </div>

              {selected.length > 0 && (
                <div className="p-6 bg-white/[0.02] space-y-3">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-zinc-400">Total Items:</span>
                    <span className="font-semibold">{totalItems} units</span>
                  </div>
                  <Link 
                    to="/reserve" 
                    state={{ prefillItems: selected }} 
                    className="btn-primary w-full text-center flex items-center justify-center gap-2"
                    data-testid="continue-reserve-btn"
                  >
                    Continue as Reserve <ArrowRight size={16} />
                  </Link>
                  <Link 
                    to="/restock" 
                    state={{ prefillItems: selected }} 
                    className="btn-secondary w-full text-center flex items-center justify-center gap-2"
                    data-testid="continue-restock-btn"
                  >
                    Continue as Quick Restock
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
