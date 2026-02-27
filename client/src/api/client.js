const base = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

export const api = {
  health: () => request('/health'),
  inventory: (status) => request(`/inventory${status ? `?status=${status}` : ''}`),
  media: () => request('/media'),
  createRequest: (payload) => request('/requests', { method: 'POST', body: JSON.stringify(payload) }),
  adminRequests: (token) => request('/admin/requests', { headers: { Authorization: `Bearer ${token}` } }),
  updateRequest: (id, payload, token) => request(`/admin/requests/${id}`, { method: 'PATCH', body: JSON.stringify(payload), headers: { Authorization: `Bearer ${token}` } }),
  createInventory: (payload, token) => request('/admin/inventory', { method: 'POST', body: JSON.stringify(payload), headers: { Authorization: `Bearer ${token}` } }),
  updateInventory: (id, payload, token) => request(`/admin/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(payload), headers: { Authorization: `Bearer ${token}` } }),
  createMedia: (payload, token) => request('/admin/media', { method: 'POST', body: JSON.stringify(payload), headers: { Authorization: `Bearer ${token}` } }),
  deleteMedia: (id, token) => request(`/admin/media/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
};
