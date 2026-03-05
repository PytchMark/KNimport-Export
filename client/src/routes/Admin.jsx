import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Package, Users, Image, Settings, LogOut,
  ChevronRight, Plus, Search, Filter, Upload, Trash2, X,
  Clock, Phone, Mail, Building, Loader2
} from 'lucide-react';

const statuses = ['new', 'contacted', 'quoted', 'confirmed', 'fulfilled', 'archived'];
const statusColors = {
  new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  quoted: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
  fulfilled: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  archived: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
};

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: Package, label: 'Requests', key: 'requests' },
  { icon: Package, label: 'Inventory', key: 'inventory' },
  { icon: Image, label: 'Media', key: 'media' }
];

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const login = async () => {
    if (!supabase) return setMsg('Supabase not configured');
    setLoading(true);
    setMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      localStorage.setItem('admin_token', data.session.access_token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="font-serif font-bold text-black text-2xl">K</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-zinc-500 text-sm mt-2">Sign in to access the dashboard</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 space-y-5">
          <div>
            <label className="input-label">Email</label>
            <input 
              type="email"
              className="input" 
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-email-input"
            />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              data-testid="admin-password-input"
            />
          </div>
          
          {msg && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">{msg}</p>
          )}
          
          <button 
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={login}
            disabled={loading}
            data-testid="admin-login-btn"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [media, setMedia] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Inventory form
  const [newItem, setNewItem] = useState({ name: '', status: 'available_now', unit_label: 'per box', quality_note: '' });
  
  // Media upload
  const [uploading, setUploading] = useState(false);
  
  const token = localStorage.getItem('admin_token');

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqData, invData, mediaData] = await Promise.all([
        api.adminRequests(token),
        api.inventory(),
        api.media()
      ]);
      setRequests(reqData.requests || []);
      setInventory(invData.items || []);
      setMedia(mediaData.assets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (token) loadData(); 
  }, [token]);

  const counts = useMemo(() => ({
    new: requests.filter((r) => r.status === 'new').length,
    contacted: requests.filter((r) => r.status === 'contacted').length,
    quoted: requests.filter((r) => r.status === 'quoted').length,
    confirmed: requests.filter((r) => r.status === 'confirmed').length,
    fulfilled: requests.filter((r) => r.status === 'fulfilled').length
  }), [requests]);

  const updateRequestStatus = async (id, newStatus) => {
    await api.updateRequest(id, { status: newStatus }, token);
    loadData();
  };

  const addInventoryItem = async () => {
    if (!newItem.name) return;
    await api.createInventory(newItem, token);
    setNewItem({ name: '', status: 'available_now', unit_label: 'per box', quality_note: '' });
    loadData();
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // Get signature from backend
      const sigRes = await fetch(`/api/cloudinary/signature?resource_type=image`);
      const sig = await sigRes.json();
      
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sig.api_key);
      formData.append('timestamp', sig.timestamp);
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);
      
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      if (uploadData.secure_url) {
        await api.createMedia({ 
          url: uploadData.secure_url, 
          type: 'image', 
          tag: 'fresh_closeup' 
        }, token);
        loadData();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const deleteMediaItem = async (id) => {
    await api.deleteMedia(id, token);
    loadData();
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-background-paper border-r border-border fixed left-0 top-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-serif font-bold text-black text-lg">K</span>
              </div>
              <div>
                <span className="font-semibold block">K&N Admin</span>
                <span className="text-xs text-zinc-500">Dashboard</span>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.key 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
                data-testid={`sidebar-${item.key}`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-zinc-500 mt-1">Overview of your operations</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'New Requests', count: counts.new, color: 'text-blue-500' },
                      { label: 'Contacted', count: counts.contacted, color: 'text-yellow-500' },
                      { label: 'Quoted', count: counts.quoted, color: 'text-purple-500' },
                      { label: 'Confirmed', count: counts.confirmed, color: 'text-green-500' },
                      { label: 'Fulfilled', count: counts.fulfilled, color: 'text-emerald-500' }
                    ].map((stat) => (
                      <div key={stat.label} className="glass-strong rounded-2xl p-5">
                        <p className="text-sm text-zinc-400">{stat.label}</p>
                        <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.count}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Requests */}
                  <div className="glass-strong rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                      <h2 className="text-xl font-semibold">Recent Requests</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                      {requests.slice(0, 5).map((req) => (
                        <div key={req.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{req.business_name}</p>
                              <p className="text-sm text-zinc-500">{req.reference_id} · {req.request_type}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[req.status]}`}>
                              {req.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Requests Tab */}
              {activeTab === 'requests' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">Requests Pipeline</h1>
                      <p className="text-zinc-500 mt-1">Manage customer requests</p>
                    </div>
                  </div>

                  {/* Pipeline Board */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {statuses.map((status) => (
                      <div key={status} className="glass-strong rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                          <span className="font-mono text-xs uppercase tracking-wider">{status}</span>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                            {requests.filter((r) => r.status === status).length}
                          </span>
                        </div>
                        <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
                          {requests.filter((r) => r.status === status).map((req) => (
                            <button
                              key={req.id}
                              onClick={() => setSelectedRequest(req)}
                              className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <p className="font-medium text-sm truncate">{req.business_name}</p>
                              <p className="text-xs text-zinc-500 mt-1">{req.reference_id}</p>
                              <p className="text-xs text-zinc-600 capitalize">{req.request_type}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">Inventory Manager</h1>
                      <p className="text-zinc-500 mt-1">Manage your produce catalog</p>
                    </div>
                  </div>

                  {/* Add Item Form */}
                  <div className="glass-strong rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Add New Item</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input
                        className="input"
                        placeholder="Item name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        data-testid="inventory-name-input"
                      />
                      <select
                        className="input"
                        value={newItem.status}
                        onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                      >
                        <option value="available_now">Available Now</option>
                        <option value="next_container">Next Container</option>
                        <option value="seasonal_limited">Seasonal / Limited</option>
                      </select>
                      <input
                        className="input"
                        placeholder="Unit label (e.g., per box)"
                        value={newItem.unit_label}
                        onChange={(e) => setNewItem({ ...newItem, unit_label: e.target.value })}
                      />
                      <button
                        onClick={addInventoryItem}
                        className="btn-primary flex items-center justify-center gap-2"
                        data-testid="add-inventory-btn"
                      >
                        <Plus size={18} /> Add Item
                      </button>
                    </div>
                  </div>

                  {/* Inventory List */}
                  <div className="glass-strong rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-mono uppercase tracking-wider text-zinc-500">
                      <div className="col-span-4">Name</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-3">Unit</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    {inventory.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 items-center hover:bg-white/[0.02]">
                        <div className="col-span-4 font-medium">{item.name}</div>
                        <div className="col-span-3">
                          <span className={
                            item.status === 'available_now' ? 'badge-available' :
                            item.status === 'next_container' ? 'badge-coming' : 'badge-limited'
                          }>
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="col-span-3 text-zinc-400">{item.unit_label || '—'}</div>
                        <div className="col-span-2">
                          <button className="text-zinc-500 hover:text-white">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">Media Gallery</h1>
                      <p className="text-zinc-500 mt-1">Manage proof wall images</p>
                    </div>
                    <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                      {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                      Upload Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleMediaUpload} disabled={uploading} />
                    </label>
                  </div>

                  {/* Media Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {media.map((asset) => (
                      <div key={asset.id} className="group relative aspect-square rounded-xl overflow-hidden">
                        <img src={asset.url} alt={asset.tag} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => deleteMediaItem(asset.id)}
                            className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors"
                          >
                            <Trash2 className="text-red-400" size={20} />
                          </button>
                        </div>
                        {asset.tag && (
                          <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
                            {asset.tag}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-2xl glass-strong rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-primary">{selectedRequest.reference_id}</p>
                  <h2 className="text-xl font-bold mt-1">{selectedRequest.business_name}</h2>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="text-zinc-500" size={16} />
                    <span>{selectedRequest.business_type || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-zinc-500" size={16} />
                    <span>{selectedRequest.phone_whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-zinc-500" size={16} />
                    <span>{selectedRequest.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-zinc-500" size={16} />
                    <span className="capitalize">{selectedRequest.urgency?.replace('_', '-') || 'Normal'}</span>
                  </div>
                </div>

                {selectedRequest.notes && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-sm">{selectedRequest.notes}</p>
                  </div>
                )}

                {selectedRequest.request_items?.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Requested Items</p>
                    {selectedRequest.request_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span>{item.custom_item_name || `Item ${idx + 1}`}</span>
                        <span className="text-zinc-400">× {item.quantity} {item.unit_label || ''}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          updateRequestStatus(selectedRequest.id, status);
                          setSelectedRequest(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-colors ${
                          selectedRequest.status === status 
                            ? statusColors[status] 
                            : 'border-white/10 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
