import { AUTH_URL } from "./config.js";
import { updateUI, logout } from "./auth.js";

export async function apiFetch(url, options = {}) {
  let res = await fetch(url, {
    credentials: "include",
    ...options,
  });

  if (res.status === 401) {
    const refresh = await refreshSession();
    if (refresh) {
      res = await fetch(url, {
        credentials: "include",
        ...options,
      });
    } else {
      logout(true);
    }
  }

  return res;
}

async function refreshSession() {
  try {
    const res = await fetch(`${AUTH_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    window.currentUser = data.user;
    updateUI(data.user);

    return true;
  } catch {
    return false;
  }
}
