import axios from "axios";

const root = import.meta.env.VITE_API_URL || "";
const apiBase = root ? `${root.replace(/\/$/, "")}/api` : "/api";

export const api = axios.create({
  baseURL: apiBase,
  headers: { "Content-Type": "application/json" },
});

export const adminApi = axios.create({
  baseURL: apiBase,
  headers: { "Content-Type": "application/json" },
});

export function setCustomerAuth(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function setAdminAuth(token) {
  if (token) adminApi.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete adminApi.defaults.headers.common.Authorization;
}
