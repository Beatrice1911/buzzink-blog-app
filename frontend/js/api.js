import { AUTH_URL } from "./config.js";
import { normalizeUser, updateUI } from "./auth.js";

export async function apiFetch(url, options = {}) {
  let token = localStorage.getItem("token");

  if (!options.headers) options.headers = {};
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = url;

  let res = await fetch(fullUrl, {
    credentials: "include",
    ...options,
  });

  if (res.status === 401) {
    token = await refreshToken();
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
      res = await fetch(fullUrl, {
        credentials: "include",
        ...options,
      });
    }
  }

  return res;
}

async function refreshToken() {
  const storedRefreshToken = localStorage.getItem("refreshToken");
  if (!storedRefreshToken) return null;

  try {
    const res = await fetch(`${AUTH_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });

    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    if (data.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);

    const user = normalizeUser(data.user);
    localStorage.setItem("user", JSON.stringify(user));
    window.currentUser = user;
    updateUI(user);

    return data.token;
  } catch (err) {
    return null;
  }
}