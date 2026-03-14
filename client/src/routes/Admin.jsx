import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { 
  LayoutDashboard, Package, Image, LogOut, Plus, Trash2, X,
  Clock, Phone, Mail, Building, Loader2, User, Upload, Check,
  AlertCircle, RefreshCw, Eye, EyeOff, ChevronDown, ImagePlus, Edit2
} from 'lucide-react';

// Status configuration
const REQUEST_STATUSES = ['new', 'contacted', 'quoted', 'confirmed', 'fulfilled', 'archived'];
const STATUS_STYLES = {
  new: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  contacted: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  quoted: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  confirmed: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  fulfilled: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
  archived: { bg: 'bg-zinc-500/15', text: 'text-zinc-400', border: 'border-zinc-500/30' }
};

// Media categories
const MEDIA_CATEGORIES = [
  { value: 'hero', label: 'Hero Slideshow', icon: '🖼️' },
  { value: 'inventory', label: 'Product Images', icon: '📦' },
  { value: 'delivery', label: 'Delivery Proofs', icon: '🚚' },
  { value: 'quality', label: 'Quality Shots', icon: '✅' },
  { value: 'gallery', label: 'General Gallery', icon: '🎨' }
];

// Sidebar navigation
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', key: 'dashboard' },
  { icon: Package, label: 'Requests', key: 'requests' },
  { icon: Package, label: 'Inventory', key: 'inventory' },
  { icon: Image, label: 'Media Library', key: 'media' }
];

// ============ LOGIN COMPONENT ============
export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
      <motion.div 
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <span className="font-serif font-bold text-black text-xl">K&N</span>
          </div>
          <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
          <p className="text-zinc-500 text-sm mt-1">K&N Import & Export</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="admin-username-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all pr-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="admin-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-gradient-to-r from-amber-500 to-green-500 text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="admin-login-btn"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-4">Internal admin access only</p>
      </motion.div>
    </div>
  );
}

// ============ DASHBOARD COMPONENT ============
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [media, setMedia] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Forms
  const [newItem, setNewItem] = useState({ name: '', status: 'available_now', unit_label: 'per box' });
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('gallery');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  
  const token = localStorage.getItem('admin_token');

  // Show notification
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Load user info
  useEffect(() => {
    const user = localStorage.getItem('admin_user');
    if (user) {
      try { setCurrentUser(JSON.parse(user)); } catch {}
    }
  }, []);

  // Load all data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reqRes, invRes, mediaRes] = await Promise.all([
        api.adminRequests(token).catch(() => ({ requests: [] })),
        api.adminInventory(token).catch(() => ({ items: [] })),
        api.media().catch(() => ({ assets: [] }))
      ]);
      setRequests(reqRes.requests || []);
      setInventory(invRes.items || []);
      setMedia(mediaRes.assets || []);
    } catch (err) {
      console.error('Load error:', err);
      if (err.message?.includes('401')) logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (token) loadData(); }, [token, loadData]);

  // Stats
  const stats = useMemo(() => ({
    newRequests: requests.filter(r => r.status === 'new').length,
    inProgress: requests.filter(r => ['contacted', 'quoted', 'confirmed'].includes(r.status)).length,
    fulfilled: requests.filter(r => r.status === 'fulfilled').length,
    totalInventory: inventory.length,
    totalMedia: media.length,
    heroImages: media.filter(m => m.category === 'hero').length
  }), [requests, inventory, media]);

  const filteredMedia = useMemo(() => {
    if (mediaFilter === 'all') return media;
    return media.filter(m => m.category === mediaFilter);
  }, [media, mediaFilter]);

  // Actions
  const updateRequestStatus = async (id, status) => {
    try {
      await api.updateRequest(id, { status }, token);
      showNotification('Request updated');
      loadData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const addInventoryItem = async () => {
    if (!newItem.name.trim()) return;
    try {
      await api.createInventory(newItem, token);
      setNewItem({ name: '', status: 'available_now', unit_label: 'per box' });
      showNotification('Item added to inventory');
      loadData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const deleteInventoryItem = async (id) => {
    if (!confirm('Remove this item from inventory?')) return;
    try {
      await api.deleteInventory(id, token);
      showNotification('Item removed');
      loadData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const saveEditItem = async () => {
    if (!editingItem || !editingItem.name.trim()) return;
    try {
      await api.updateInventory(editingItem.id, {
        name: editingItem.name,
        status: editingItem.status,
        unit_label: editingItem.unit_label
      }, token);
      showNotification('Item updated');
      setEditingItem(null);
      loadData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleFileUpload = async (files) => {
    if (!files?.length) return;
    
    setUploading(true);
    let successCount = 0;
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', uploadCategory);
        formData.append('tag', uploadCategory);
        
        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Upload failed');
        }
        successCount++;
      } catch (err) {
        showNotification(`Failed to upload ${file.name}: ${err.message}`, 'error');
      }
    }
    
    setUploading(false);
    if (successCount > 0) {
      showNotification(`${successCount} file(s) uploaded successfully`);
      loadData();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) handleFileUpload(files);
  };

  const deleteMediaItem = async (id) => {
    if (!confirm('Delete this media asset?')) return;
    try {
      await api.deleteMedia(id, token);
      showNotification('Media deleted');
      loadData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin';
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === 'error' 
                ? 'bg-red-500/90 text-white' 
                : 'bg-emerald-500/90 text-white'
            }`}
          >
            {notification.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-60 bg-zinc-900/50 border-r border-zinc-800 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-green-500 flex items-center justify-center">
              <span className="font-serif font-bold text-black text-sm">K&N</span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">K&N Admin</p>
              <p className="text-xs text-zinc-500">Import & Export</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-800/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/20 to-green-500/20 flex items-center justify-center">
                <User className="text-amber-400" size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{currentUser.username}</p>
                <p className="text-xs text-zinc-500 capitalize">
                  {currentUser.role === 'masteradmin' ? 'Master Admin' : 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.key 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent'
              }`}
              data-testid={`sidebar-${item.key}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            data-testid="logout-btn"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-amber-400" size={32} />
          </div>
        ) : (
          <>
            {/* ========== DASHBOARD TAB ========== */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-zinc-500 text-sm mt-1">Welcome back, {currentUser?.username}</p>
                  </div>
                  <button onClick={loadData} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm">
                    <RefreshCw size={16} /> Refresh
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {[
                    { label: 'New Requests', value: stats.newRequests, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'In Progress', value: stats.inProgress, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Fulfilled', value: stats.fulfilled, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Inventory', value: stats.totalInventory, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Media Assets', value: stats.totalMedia, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    { label: 'Hero Images', value: stats.heroImages, color: 'text-pink-400', bg: 'bg-pink-500/10' }
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} border border-zinc-800 rounded-xl p-4`}>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                      <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Requests */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="font-semibold text-white">Recent Requests</h2>
                    <button onClick={() => setActiveTab('requests')} className="text-amber-400 text-sm hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {requests.slice(0, 5).map((req) => (
                      <div key={req.id} className="px-5 py-4 hover:bg-zinc-800/30 transition-colors flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{req.business_name}</p>
                          <p className="text-sm text-zinc-500">{req.reference_id} • {req.request_type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[req.status]?.bg} ${STATUS_STYLES[req.status]?.text}`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                    {requests.length === 0 && (
                      <p className="px-5 py-8 text-center text-zinc-500">No requests yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========== REQUESTS TAB ========== */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Request Pipeline</h1>
                  <p className="text-zinc-500 text-sm mt-1">Manage and track customer requests</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {REQUEST_STATUSES.map((status) => {
                    const items = requests.filter(r => r.status === status);
                    const style = STATUS_STYLES[status];
                    return (
                      <div key={status} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className={`px-4 py-3 border-b border-zinc-800 ${style.bg}`}>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold uppercase tracking-wider ${style.text}`}>{status}</span>
                            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{items.length}</span>
                          </div>
                        </div>
                        <div className="p-2 max-h-[400px] overflow-y-auto space-y-2">
                          {items.map((req) => (
                            <button
                              key={req.id}
                              onClick={() => setSelectedRequest(req)}
                              className="w-full text-left p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                            >
                              <p className="font-medium text-white text-sm truncate">{req.business_name}</p>
                              <p className="text-xs text-zinc-500 mt-1">{req.reference_id}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========== INVENTORY TAB ========== */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Inventory Manager</h1>
                  <p className="text-zinc-500 text-sm mt-1">Manage your product catalog</p>
                </div>

                {/* Add Form */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-medium text-white mb-4">Add New Product</h3>
                  <div className="flex flex-wrap gap-3">
                    <input
                      className="flex-1 min-w-[200px] bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                      placeholder="Product name (e.g. Fresh Mangoes)"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addInventoryItem()}
                      data-testid="inventory-name-input"
                    />
                    <select
                      className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50"
                      value={newItem.status}
                      onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                      data-testid="inventory-status-select"
                    >
                      <option value="available_now">Available Now</option>
                      <option value="next_container">Next Container</option>
                      <option value="seasonal_limited">Limited / Seasonal</option>
                    </select>
                    <input
                      className="w-32 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                      placeholder="Unit"
                      value={newItem.unit_label}
                      onChange={(e) => setNewItem({ ...newItem, unit_label: e.target.value })}
                    />
                    <button
                      onClick={addInventoryItem}
                      disabled={!newItem.name.trim()}
                      className="bg-gradient-to-r from-amber-500 to-green-500 text-black font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                      data-testid="add-inventory-btn"
                    >
                      <Plus size={18} /> Add
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left px-5 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Product</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Unit</th>
                        <th className="text-right px-5 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="px-5 py-4">
                            {editingItem?.id === item.id ? (
                              <input
                                className="bg-zinc-800 border border-amber-500/50 rounded px-3 py-1.5 text-white w-full focus:outline-none"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                autoFocus
                              />
                            ) : (
                              <span className="font-medium text-white">{item.name}</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {editingItem?.id === item.id ? (
                              <select
                                className="bg-zinc-800 border border-amber-500/50 rounded px-3 py-1.5 text-white focus:outline-none"
                                value={editingItem.status}
                                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                              >
                                <option value="available_now">Available Now</option>
                                <option value="next_container">Next Container</option>
                                <option value="seasonal_limited">Limited / Seasonal</option>
                              </select>
                            ) : (
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.status === 'available_now' ? 'bg-emerald-500/15 text-emerald-400' :
                                item.status === 'next_container' ? 'bg-amber-500/15 text-amber-400' :
                                'bg-red-500/15 text-red-400'
                              }`}>
                                {item.status?.replace(/_/g, ' ')}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {editingItem?.id === item.id ? (
                              <input
                                className="bg-zinc-800 border border-amber-500/50 rounded px-3 py-1.5 text-white w-24 focus:outline-none"
                                value={editingItem.unit_label || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, unit_label: e.target.value })}
                              />
                            ) : (
                              <span className="text-zinc-400">{item.unit_label || '—'}</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            {editingItem?.id === item.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={saveEditItem}
                                  className="text-emerald-400 hover:text-emerald-300 p-2 bg-emerald-500/10 rounded-lg"
                                  title="Save"
                                >
                                  <Check size={16} />
                                </button>
                                <button 
                                  onClick={() => setEditingItem(null)}
                                  className="text-zinc-400 hover:text-zinc-300 p-2 bg-zinc-700/50 rounded-lg"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => setEditingItem({ ...item })}
                                  className="text-amber-400 hover:text-amber-300 p-2"
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => deleteInventoryItem(item.id)}
                                  className="text-red-400 hover:text-red-300 p-2"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {inventory.length === 0 && (
                    <p className="px-5 py-12 text-center text-zinc-500">No inventory items yet. Add your first product above.</p>
                  )}
                </div>
              </div>
            )}

            {/* ========== MEDIA TAB ========== */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Media Library</h1>
                  <p className="text-zinc-500 text-sm mt-1">Upload and manage images for your website</p>
                </div>

                {/* Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragOver 
                      ? 'border-amber-500 bg-amber-500/10' 
                      : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                      {uploading ? <Loader2 className="animate-spin text-amber-400" size={28} /> : <ImagePlus className="text-zinc-400" size={28} />}
                    </div>
                    <p className="text-white font-medium mb-1">
                      {uploading ? 'Uploading...' : 'Drag & drop images here'}
                    </p>
                    <p className="text-zinc-500 text-sm mb-4">or click to browse files</p>
                    
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <select
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        data-testid="upload-category-select"
                      >
                        {MEDIA_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                        ))}
                      </select>
                      
                      <label className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium cursor-pointer transition-all ${
                        uploading 
                          ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-amber-500 to-green-500 text-black hover:opacity-90'
                      }`}>
                        <Upload size={18} />
                        {uploading ? 'Uploading...' : 'Select Files'}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                          disabled={uploading}
                          data-testid="file-upload-input"
                        />
                      </label>
                    </div>
                    <p className="text-zinc-600 text-xs mt-4">Supported formats: JPG, PNG, WebP • Max 10MB per file</p>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setMediaFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      mediaFilter === 'all' 
                        ? 'bg-amber-500 text-black' 
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    All ({media.length})
                  </button>
                  {MEDIA_CATEGORIES.map((cat) => {
                    const count = media.filter(m => m.category === cat.value).length;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setMediaFilter(cat.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          mediaFilter === cat.value 
                            ? 'bg-amber-500 text-black' 
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {cat.icon} {cat.label} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Media Grid */}
                {filteredMedia.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map((asset) => (
                      <div key={asset.id} className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-800">
                        <img
                          src={asset.url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text fill="%23666" x="50" y="55" text-anchor="middle" font-size="12">Error</text></svg>'; }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => deleteMediaItem(asset.id)}
                            className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
                          >
                            <Trash2 className="text-red-400" size={20} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                            {asset.category || 'gallery'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                    <Image className="mx-auto text-zinc-600 mb-4" size={48} />
                    <p className="text-zinc-400 font-medium">No media in this category</p>
                    <p className="text-zinc-600 text-sm mt-1">Upload images using the form above</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

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
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-amber-400 text-xs font-mono">{selectedRequest.reference_id}</p>
                  <h2 className="text-lg font-semibold text-white mt-1">{selectedRequest.business_name}</h2>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Building className="text-zinc-500" size={16} />
                    {selectedRequest.business_type || 'Not specified'}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Phone className="text-zinc-500" size={16} />
                    {selectedRequest.phone_whatsapp}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Mail className="text-zinc-500" size={16} />
                    {selectedRequest.email || 'No email'}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="text-zinc-500" size={16} />
                    {selectedRequest.urgency?.replace(/_/g, ' ') || 'Normal'}
                  </div>
                </div>

                {selectedRequest.notes && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <p className="text-xs text-zinc-500 uppercase mb-1">Notes</p>
                    <p className="text-sm text-zinc-300">{selectedRequest.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-zinc-500 uppercase mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {REQUEST_STATUSES.map((status) => {
                      const style = STATUS_STYLES[status];
                      const isActive = selectedRequest.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => {
                            updateRequestStatus(selectedRequest.id, status);
                            setSelectedRequest(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isActive 
                              ? `${style.bg} ${style.text} ${style.border}` 
                              : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
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
