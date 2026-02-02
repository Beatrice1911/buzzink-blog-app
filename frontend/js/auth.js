import { apiFetch, refreshSession } from "./api.js";
import { AUTH_URL, DEFAULT_AVATAR } from "./config.js";
import { showToast } from "./ui.js";
import { refreshPage } from "./posts.js";
import { userIcon, userMenuDetails } from "./ui.js";

export const loginForm = document.getElementById("loginForm");
export const registerForm = document.getElementById("registerForm");
const logoutBtn = document.getElementById("logoutBtn");

export function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,
  };
}

window.currentUser = (() => {
  const stored = localStorage.getItem("user");
  return stored ? normalizeUser(JSON.parse(stored)) : null;
})();

export function updateUI(user) {
  if (user?.id) {
    userIcon.forEach((icon) => (icon.title = `Logged in as ${user.name}`));
  } else {
    userIcon.forEach((icon) => (icon.title = "Click to Login/Register"));
    userMenuDetails?.classList.remove("show");
  }
}

export async function updateAvatar(user) {
  try {
    const res = await apiFetch("/api/users/me");

    if (!res.ok) return;

    user = await res.json();

    const avatars = document.querySelectorAll(".user-icon");
    if (avatars) {
      avatars.forEach((avatar) => {
        avatar.src = user.profilePhoto?.trim()
          ? user.profilePhoto
          : DEFAULT_AVATAR;
      });
    }

    window.currentUser = user;
  } catch (err) {
    console.warn("Failed to load auth user:", err);
  }
}

function initLogin() {
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    console.log("Login Triggered");

    const res = await apiFetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (!res.ok) {
      showToast(`Login failed: ${data.message || "Unknown error"}`, "error");
    }

    const user = normalizeUser(data.user);
    localStorage.setItem("user", JSON.stringify(user));
    window.currentUser = user;
    localStorage.setItem("role", user.role);
    if (user.role === "admin") {
      window.location.href = "admin.html";
    }

    updateUI(user);
    updateAvatar(user);
    authModal.classList.add("hidden");
    loginForm.reset();
    showToast(`Welcome back, ${user.name}!`, "success");
    refreshPage();
  });
}

function initRegister() {
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const res = await apiFetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    console.log("Register response:", data);

    if (!res.ok) {
      showToast(
        `Registration failed: ${data.message || "Unknown error"}`,
        "error",
      );
    }

    const user = normalizeUser(data.user);
    localStorage.setItem("user", JSON.stringify(user));
    window.currentUser = user;
    localStorage.setItem("role", user.role);
    updateUI(user);
    updateAvatar(user);
    authModal.classList.add("hidden");
    registerForm.reset();
    showToast(
      `Welcome, ${user.name}! Your account has been created.`,
      "success",
    );
  });
}

function initLogout() {
  logoutBtn?.addEventListener("click", () => {
    logout();
    window.location.href = "index.html";
  });
}

export async function checkUser() {
  const refreshed = await refreshSession();

  if (!refreshed || !window.currentUser) {
    localStorage.removeItem("user");
    updateUI(null);
    updateAvatar(null);
    return null;
  }

  const user = window.currentUser;

  localStorage.setItem("user", JSON.stringify(user));
  updateUI(user);
  updateAvatar(user);

  return user;
}

export async function logout(silent = false) {
  try {
    await fetch(`${AUTH_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.warn("Logout request failed:", err);
  }

  localStorage.removeItem("user");
  window.currentUser = null;
  updateUI(null);

  if (!silent) showToast("You have been logged out.", "info");
}

function initForgotPassword() {
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  const closeForgotModal = document.getElementById("closeForgotModal");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      forgotPasswordModal.classList.remove("hidden");
    });
  }

  if (closeForgotModal) {
    closeForgotModal.addEventListener("click", () => {
      forgotPasswordModal.classList.add("hidden");
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value.trim();
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        showToast(
          data.message || "Check your email for the reset link.",
          "success",
        );
        forgotPasswordModal.classList.add("hidden");
      } catch (err) {
        console.error(err);
        showToast("Failed to send reset link. Try again.", "error");
      }
    });
  }
}

export function initAuth() {
  initLogin();
  initRegister();
  initLogout();
  initForgotPassword();
}
