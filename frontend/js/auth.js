import { apiFetch } from "./api.js";
import { AUTH_URL, DEFAULT_AVATAR } from "./config.js";
import { showToast } from "./ui.js";
import { userIcons, userMenuDetails, authModal } from "./ui.js";
import { routeByPage } from "./app.js";

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
    userIcons.forEach((icon) => (icon.title = `Logged in as ${user.name}`));
  } else {
    userIcons.forEach((icon) => (icon.title = "Click to Login/Register"));
    userMenuDetails?.classList.remove("show");
  }
}

export async function updateAvatar(user) {
  try {
    const res = await apiFetch("/api/users/me");

    if (!res.ok) return;

    user = await res.json();

    if (userIcons) {
      userIcons.forEach((icon) => {
        icon.src = user.profilePhoto?.trim()
          ? user.profilePhoto
          : DEFAULT_AVATAR;
      });
    }

    window.currentUser = user;
  } catch (err) {
    console.warn("Failed to load auth user:", err);
  }
}

const loginButton = loginForm?.querySelector("button");
const registerButton = registerForm?.querySelector("button");

function initLogin() {
  const setPostingState = (isPosting) => {
    loginButton.disabled = isPosting;
    loginButton.innerHTML = isPosting
      ? `<i class="fa-solid fa-spinner fa-spin"></i>`
      : "Login";
  };
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    console.log("Login Triggered");

    try {
      setPostingState(true);
      const res = await apiFetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        if (res.status === 403) {
          showToast(data.message || "Please verify your email first.", "error");

          showResendVerificationButton(email);

          return;
        }
        showToast(`Login failed: ${data.message || "Unknown error"}`, "error");
        return;
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
      routeByPage();
    } catch {
      setPostingState(false);
    } finally {
      setPostingState(false);
    }
  });
}

function showResendVerificationButton(email) {
  let container = document.getElementById("resendVerificationContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "resendVerificationContainer";
    container.style.textAlign = "center";
    container.style.marginTop = "10px";
    container.innerHTML = `
      <button id="resendVerificationBtn" class="resend-btn">Resend verification email</button>
    `;
    loginForm.appendChild(container);

    document
      .getElementById("resendVerificationBtn")
      .addEventListener("click", async () => {
        const res = await apiFetch(`${AUTH_URL}/resend-verification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        showToast("Verification email resent! Check your inbox.", "success");
      });
  }
}

function initRegister() {
  const setPostingState = (isPosting) => {
    registerButton.disabled = isPosting;
    registerButton.innerHTML = isPosting
      ? `<i class="fa-solid fa-spinner fa-spin"></i>`
      : "Register";
  };
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      setPostingState(true);
      const res = await apiFetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(
          `Registration failed: ${data.message || "Unknown error"}`,
          "error",
        );
        return;
      }

      showToast(
        "Registration successful! Please check your email to verify your account.",
        "success",
      );

      authModal.classList.add("hidden");
      registerForm.reset();
    } catch (err) {
      console.error(err);
      setPostingState(false);
    } finally {
      setPostingState(false);
    }
  });
}

function initLogout() {
  logoutBtn?.addEventListener("click", () => {
    logout();
    window.location.href = "index.html";
  });
}

export async function checkUser() {
  try {
    const res = await apiFetch(`${AUTH_URL}/me`);

    if (!res.ok) throw new Error("Not authenticated");

    const data = await res.json();
    const user = normalizeUser(data);
    localStorage.setItem("user", JSON.stringify(user));

    window.currentUser = user;
    updateUI(user);
    updateAvatar(user);
    return user;
  } catch (err) {
    updateUI(null);
    updateAvatar(null);
    return null;
  }
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
    forgotPasswordLink?.addEventListener("click", (e) => {
      e.preventDefault();
      forgotPasswordModal.classList.remove("hidden");
    });
  }

  if (closeForgotModal) {
    closeForgotModal?.addEventListener("click", () => {
      forgotPasswordModal.classList.add("hidden");
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value.trim();

      button.disabled = true;
      button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

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
        forgotPasswordForm.reset();
        forgotPasswordModal.classList.add("hidden");
      } catch (err) {
        console.error(err);
        showToast("Failed to send reset link. Try again.", "error");
      } finally {
        button.disabled = false;
        button.innerHTML = "Send Reset Link";
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
