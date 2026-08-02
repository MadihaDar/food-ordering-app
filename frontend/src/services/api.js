// Point this at your PHP backend. During local dev with XAMPP/Laragon
// it's usually something like http://localhost/food-ordering-app/backend/api
// export const API_BASE = 'http://localhost/food-ordering-app/backend/api';
export const API_BASE = 'http://localhost:8000/api';

function authHeaders() {
  const token = localStorage.getItem('zaiqa_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const res = await fetch(`${API_BASE}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? authHeaders() : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  getCategories: () => request('categories.php'),
  getMenu: (categorySlug) =>
    request(`menu.php${categorySlug ? `?category=${categorySlug}` : ''}`),
  getMenuAdmin: () => request('menu.php?all=1', { auth: true }),
  addMenuItem: (item) => request('menu.php', { method: 'POST', body: item, auth: true }),
  updateMenuItem: (id, item) =>
    request(`menu.php?id=${id}`, { method: 'PUT', body: item, auth: true }),
  deleteMenuItem: (id) => request(`menu.php?id=${id}`, { method: 'DELETE', auth: true }),

  placeOrder: (order) => request('orders.php', { method: 'POST', body: order }),
  getOrders: (status) =>
    request(`orders.php${status ? `?status=${status}` : ''}`, { auth: true }),
  updateOrderStatus: (id, status) =>
    request(`orders.php?id=${id}`, { method: 'PUT', body: { status }, auth: true }),

  login: (username, password) =>
    request('auth.php', { method: 'POST', body: { username, password } }),
};
