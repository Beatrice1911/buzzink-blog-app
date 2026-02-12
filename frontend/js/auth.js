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

const loginButton = document.getElementById("login-btn");
const registerButton = document.getElementById("register-btn");

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
    } catch (err) {
      console.error(err);
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
      <button type="button" id="resendVerificationBtn" class="resend-btn">Resend verification email</button>
    `;
    loginForm.appendChild(container);

    const btn = document.getElementById("resendVerificationBtn");

    btn.addEventListener("click", async () => {
      e.preventDefault();
      e.stopPropagation();
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

function initPasswordStrength() {
  const passwordInput = document.querySelector(
    "#registerPassword, #newPassword",
  );
  const container = document.querySelector(".password-strength");
  const bar = document.querySelector(".strength-bar");
  const text = document.getElementById("strengthText");

  if (!passwordInput || !container || !bar || !text) return;

  passwordInput?.addEventListener("input", () => {
    const val = passwordInput.value;

    if (!val) {
      container.style.display = "none";
      text.style.display = "none";
      bar.style.width = "0%";
      text.textContent = "";
      passwordInput.dataset.strength = "weak";
      return;
    }

    container.style.display = "block";
    text.style.display = "block";

    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const states = [
      { width: "25%", color: "#e74c3c", label: "Weak" },
      { width: "50%", color: "#f39c12", label: "Fair" },
      { width: "75%", color: "#3498db", label: "Good" },
      { width: "100%", color: "#2ecc71", label: "Strong" },
    ];

    const state = states[Math.max(score - 1, 0)];

    bar.style.width = state.width;
    bar.style.background = state.color;
    text.textContent = `Strength: ${state.label}`;

    passwordInput.dataset.strength =
      state.label === "Strong" ? "strong" : "weak";
  });
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

    const passwordInput = document.getElementById("registerPassword");

    if (passwordInput.dataset.strength !== "strong") {
      showToast(
        "Please choose a stronger password before registering.",
        "error",
      );
      return;
    }

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
      const button = forgotPasswordForm.querySelector("button");

      try {
        button.disabled = true;
        button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
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

function initResetPassword() {
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  resetPasswordForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const passwordInput = document.getElementById("newPassword");

    if (passwordInput.dataset.strength !== "strong") {
      showToast(
        "Please choose a stronger password before registering.",
        "error",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "info");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      showToast("Invalid or missing reset token", "error");
      return;
    }

    try {
      const res = await fetch(
        `https://buzzink.onrender.com/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Password reset failed", "error");
        return;
      }

      showToast("Password reset successful! You can now log in.", "success");
      window.location.href = "/index.html";
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    }
  });
}

export function initAuth() {
  initLogin();
  initPasswordStrength();
  initRegister();
  initLogout();
  initForgotPassword();
  initResetPassword();
}
