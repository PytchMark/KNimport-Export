import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { 
  LayoutDashboard, Package, Users, Image, Settings, LogOut,
  ChevronRight, Plus, Search, Filter, Upload, Trash2, X,
  Clock, Phone, Mail, Building, Loader2, Edit2, Eye, EyeOff, User
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

const mediaCategories = [
  { value: 'hero', label: 'Hero Images', desc: 'Homepage slideshow' },
  { value: 'inventory', label: 'Inventory', desc: 'Product images' },
  { value: 'delivery', label: 'Delivery', desc: 'Delivery proof shots' },
  { value: 'quality', label: 'Quality', desc: 'QC inspection photos' },
  { value: 'gallery', label: 'Gallery', desc: 'General gallery' }
];

const mediaTags = ['fresh_closeup', 'delivery', 'shelf_stock', 'container_day', 'gallery'];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: Package, label: 'Requests', key: 'requests' },
  { icon: Package, label: 'Inventory', key: 'inventory' },
  { icon: Image, label: 'Media', key: 'media' }
];

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store token and user info
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
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

        <form onSubmit={login} className="glass-strong rounded-2xl p-8 space-y-5">
          <div>
            <label className="input-label">Username</label>
            <div className="relative">
              <input 
                type="text"
                className="input pl-10" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                data-testid="admin-username-input"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            </div>
          </div>
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="input pr-12" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="admin-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2" data-testid="login-error">
              {error}
            </p>
          )}
          
          <button 
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={loading}
            data-testid="admin-login-btn"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
          </button>

          <p className="text-xs text-zinc-600 text-center">
            Internal admin access only
          </p>
        </form>
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
  const [currentUser, setCurrentUser] = useState(null);
  
  // Inventory form
  const [newItem, setNewItem] = useState({ name: '', status: 'available_now', unit_label: 'per box', quality_note: '' });
  
  // Media upload state
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('gallery');
  const [uploadTag, setUploadTag] = useState('gallery');
  const [mediaFilter, setMediaFilter] = useState('all');
  
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    const user = localStorage.getItem('admin_user');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch {}
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqData, invData, mediaData] = await Promise.all([
        api.adminRequests(token),
        api.adminInventory(token),
        api.media()
      ]);
      setRequests(reqData.requests || []);
      setInventory(invData.items || []);
      setMedia(mediaData.assets || []);
    } catch (err) {
      console.error(err);
      // If unauthorized, redirect to login
      if (err.message?.includes('401') || err.message?.includes('unauthorized')) {
        logout();
      }
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

  const filteredMedia = useMemo(() => {
    if (mediaFilter === 'all') return media;
    return media.filter((m) => m.category === mediaFilter);
  }, [media, mediaFilter]);

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
    const files = e.target.files;
    if (!files?.length) return;
    
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', uploadCategory);
        formData.append('tag', uploadTag);
        
        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Upload failed');
        }
      }
      loadData();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const deleteMediaItem = async (id) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    await api.deleteMedia(id, token);
    loadData();
  };

  const deleteInventoryItem = async (id) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    await api.deleteInventory(id, token);
    loadData();
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
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
          
          {/* Current User Info */}
          {currentUser && (
            <div className="px-4 py-3 border-b border-border bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="text-primary" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">{currentUser.username}</p>
                  <p className="text-xs text-zinc-500 capitalize">
                    {currentUser.role === 'masteradmin' ? '⭐ Master Admin' : 'Admin'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
              data-testid="logout-btn"
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

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-strong rounded-2xl p-5">
                      <p className="text-sm text-zinc-400">Total Inventory Items</p>
                      <p className="text-3xl font-bold mt-1 text-primary">{inventory.length}</p>
                    </div>
                    <div className="glass-strong rounded-2xl p-5">
                      <p className="text-sm text-zinc-400">Media Assets</p>
                      <p className="text-3xl font-bold mt-1 text-secondary">{media.length}</p>
                    </div>
                    <div className="glass-strong rounded-2xl p-5">
                      <p className="text-sm text-zinc-400">Hero Images</p>
                      <p className="text-3xl font-bold mt-1 text-yellow-500">{media.filter(m => m.category === 'hero').length}</p>
                    </div>
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
                      {requests.length === 0 && (
                        <div className="p-6 text-center text-zinc-500">No requests yet</div>
                      )}
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <input
                        className="input md:col-span-2"
                        placeholder="Item name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        data-testid="inventory-name-input"
                      />
                      <select
                        className="input"
                        value={newItem.status}
                        onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                        data-testid="inventory-status-select"
                      >
                        <option value="available_now">Available Now</option>
                        <option value="next_container">Next Container</option>
                        <option value="seasonal_limited">Seasonal / Limited</option>
                      </select>
                      <input
                        className="input"
                        placeholder="Unit (e.g., per box)"
                        value={newItem.unit_label}
                        onChange={(e) => setNewItem({ ...newItem, unit_label: e.target.value })}
                      />
                      <button
                        onClick={addInventoryItem}
                        className="btn-primary flex items-center justify-center gap-2"
                        data-testid="add-inventory-btn"
                      >
                        <Plus size={18} /> Add
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
                            {item.status?.replace('_', ' ') || 'unknown'}
                          </span>
                        </div>
                        <div className="col-span-3 text-zinc-400">{item.unit_label || '—'}</div>
                        <div className="col-span-2 flex gap-2">
                          <button 
                            onClick={() => deleteInventoryItem(item.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            data-testid={`delete-inventory-${item.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {inventory.length === 0 && (
                      <div className="px-6 py-12 text-center text-zinc-500">
                        No inventory items yet. Add your first item above.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h1 className="text-3xl font-bold">Media Gallery</h1>
                      <p className="text-zinc-500 mt-1">Manage images stored in Supabase</p>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="glass-strong rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Upload Media to Supabase Storage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="input-label">Category</label>
                        <select
                          className="input"
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          data-testid="upload-category-select"
                        >
                          {mediaCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label} - {cat.desc}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="input-label">Tag</label>
                        <select
                          className="input"
                          value={uploadTag}
                          onChange={(e) => setUploadTag(e.target.value)}
                          data-testid="upload-tag-select"
                        >
                          {mediaTags.map((tag) => (
                            <option key={tag} value={tag}>{tag.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="btn-primary cursor-pointer inline-flex items-center gap-2 w-full justify-center">
                          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                          {uploading ? 'Uploading...' : 'Choose Files to Upload'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*,video/*" 
                            onChange={handleMediaUpload} 
                            disabled={uploading}
                            multiple
                            data-testid="file-upload-input"
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-3">
                      Supported: Images (JPG, PNG, WebP) and Videos (MP4). Max 10MB per file.
                    </p>
                  </div>

                  {/* Filter */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setMediaFilter('all')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        mediaFilter === 'all' ? 'bg-primary text-black' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      All ({media.length})
                    </button>
                    {mediaCategories.map((cat) => {
                      const count = media.filter(m => m.category === cat.value).length;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setMediaFilter(cat.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            mediaFilter === cat.value ? 'bg-primary text-black' : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {cat.label} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Media Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map((asset) => (
                      <div key={asset.id} className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-900">
                        <img 
                          src={asset.url} 
                          alt={asset.tag || 'media'} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23333" width="100" height="100"/><text fill="%23666" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">No Image</text></svg>';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => deleteMediaItem(asset.id)}
                            className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors"
                            data-testid={`delete-media-${asset.id}`}
                          >
                            <Trash2 className="text-red-400" size={20} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                            {asset.category || 'gallery'}
                          </span>
                          {asset.tag && asset.tag !== asset.category && (
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded ml-1">
                              {asset.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredMedia.length === 0 && (
                    <div className="glass-strong rounded-2xl p-12 text-center">
                      <Image className="mx-auto text-zinc-600 mb-4" size={48} />
                      <p className="text-zinc-500">No media assets in this category yet.</p>
                      <p className="text-zinc-600 text-sm mt-2">Upload images using the form above.</p>
                    </div>
                  )}
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
