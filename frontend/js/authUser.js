import showToast from "./app.js";

const DEFAULT_AVATAR = "https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png";

async function loadAuthenticatedUser() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    const user = await res.json();

    const avatar = document.getElementById("navUserAvatar");
    if (avatar) {
      avatar.src = user.profilePhoto?.trim()
        ? user.profilePhoto
        : DEFAULT_AVATAR;
    }

    window.currentUser = user;

  } catch (err) {
    console.warn("Failed to load auth user:", err);
  }
}

// Forgot Password Modal Logic
document.addEventListener("DOMContentLoaded", () => {
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
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        showToast(data.message || "Check your email for the reset link.", "success");
        forgotPasswordModal.classList.add("hidden");
      } catch (err) {
        console.error(err);
        showToast("Failed to send reset link. Try again.", "error");
      }
    });
  }
});



document.addEventListener("DOMContentLoaded", loadAuthenticatedUser);
