const BASE = "http://127.0.0.1:8000/api";
export async function apiCall(method, endpoint, body = null, token = null) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(BASE + endpoint, { method, headers, body: body ? JSON.stringify(body) : null });
  return res.json();
}
export const login = (data) => apiCall("POST", "/login", data);
export const register = (data) => apiCall("POST", "/register", data);
export const logout = (token) => apiCall("POST", "/logout", null, token);
export const getProducts = () => apiCall("GET", "/products?per_page=50");
export const getCategories = () => apiCall("GET", "/categories");
export const createProduct = (data, token) => apiCall("POST", "/products", data, token);
export const updateProduct = (id, data, token) => apiCall("PUT", `/products/${id}`, data, token);
export const deleteProduct = (id, token) => apiCall("DELETE", `/products/${id}`, null, token);
export const getOrders = (token) => apiCall("GET", "/orders", null, token);
export const createOrder = (data, token) => apiCall("POST", "/orders", data, token);
export const updateOrderStatus = (id, statut, token) => apiCall("PATCH", `/orders/${id}/status`, { statut }, token);
export const getStats = (token) => apiCall("GET", "/admin/stats", null, token);
export const getUsers = (token) => apiCall("GET", "/admin/users", null, token);
export const createUser = (data, token) => apiCall("POST", "/admin/users", data, token);
export const updateUser = (id, data, token) => apiCall("PUT", `/admin/users/${id}`, data, token);
export const deleteUser = (id, token) => apiCall("DELETE", `/admin/users/${id}`, null, token);
export const deleteOrder = (id, token) => apiCall("DELETE", `/orders/${id}`, null, token);
export const createCategory = (data, token) => apiCall("POST", "/categories", data, token);
export const updateCategory = (id, data, token) => apiCall("PUT", `/categories/${id}`, data, token);
export const deleteCategory = (id, token) => apiCall("DELETE", `/categories/${id}`, null, token);
export const sendSupportMessage = (message, history) => apiCall("POST", "/support/chat", { message, history });

