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

document.addEventListener("DOMContentLoaded", loadAuthenticatedUser);
