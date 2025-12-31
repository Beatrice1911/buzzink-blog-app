const API_URI = `/api/users/me`;
const REFRESH_URI = `/api/auth/refresh`;

let tokenDashboard = localStorage.getItem("token");
let refreshTokenDashboard = localStorage.getItem("refreshToken");

// Refresh access token
async function refreshAccessToken() {
  try {
    console.log("Refreshing with token:", refreshTokenDashboard);

    const res = await fetch(REFRESH_URI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshTokenDashboard }),
    });

    const data = await res.json();

    if (res.ok && data.token && data.refreshToken) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      tokenDashboard = data.token;
      refreshTokenDashboard = data.refreshToken;
      console.log("Token refreshed successfully!");
      return true;
    }
  } catch (err) {
    console.error("Error refreshing token:", err);
    return false;
  }
}

// Fetch current user data
async function loadProfile() {
  try {
    const res = await fetch(API_URI, {
      headers: {
        Authorization: `Bearer ${tokenDashboard}`,
      },
    });

    const data = await res.json();

    // Handle expired token cases flexibly
    if (res.status === 401) {
      console.warn("Access token expired, trying refresh...");
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return loadProfile();
      } else {
        showToastUser("Session expired. Please log in again.", "error");
        window.location.href = "index.html";
        return;
      }
    }

    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

    // Update UI
    document.getElementById("userName").textContent = data.name;
    document.getElementById("userEmail").textContent = data.email;
    document.getElementById("userBio").textContent = data.bio || "No bio added yet.";
    document.getElementById("joinedDate").textContent = new Date(data.createdAt).toDateString();

   const DEFAULT_PROFILE_PHOTO =
    "https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png";

   const profileImage = data.profilePhoto && data.profilePhoto.trim() !== ""
    ? data.profilePhoto
    : DEFAULT_PROFILE_PHOTO;

  if (data.profilePhoto) {
    document.getElementById("removePhotoBtn").style.display = "block";
  }

    document.getElementById("profilePhotoPreview").src = profileImage;

    document.getElementById("name").value = data.name;
    document.getElementById("bio").value = data.bio || "";

  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

const saveChangesBtn = document.getElementById("saveChangesBtn");
saveChangesBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const profilePhotoInput = document.getElementById("profilePhoto");
  const file = profilePhotoInput.files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  if (file) {
    formData.append("profilePhoto", file);
  }

  try {
    const res = await fetch(API_URI, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${tokenDashboard}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Update response:", data);

    if (res.ok) {
      showToastUser("Profile updated successfully!", "success");

      if (data.profilePhoto) {
        document.getElementById("profilePhotoPreview").src = data.profilePhoto;
      }

      document.getElementById("userName").textContent = data.name;
      document.getElementById("userBio").textContent = data.bio || "No bio added yet.";
    } else {
      throw new Error(data.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Error saving changes:", err);
    showToastUser("Failed to update profile. Please try again.", "error");
  }
});


// Remove photo button logic
const removePhotoBtn = document.getElementById("removePhotoBtn");
removePhotoBtn.addEventListener("click", async () => {
  try {
    const formData = new FormData();
    formData.append("profilePhoto", "true");
    const res = await fetch(API_URI, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${tokenDashboard}`,
      },
      body: formData,
    });


    if (res.ok) {
      showToastUser("Profile photo removed successfully!", "success");
      loadProfile(); // Reload profile data
    } else {
      const data = await res.json();
      throw new Error(data.message || "Failed to remove profile photo");
    }

    const DEFAULT_PROFILE_PHOTO = "https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png";
    document.getElementById("profilePhotoPreview").src = DEFAULT_PROFILE_PHOTO;
  } catch (err) {
    console.error("Error removing photo:", err);
    showToastUser("Failed to remove profile photo. Please try again.", "error");
  }
});

loadProfile();

// Toast notification function
function showToastUser(message, type = "info", duration = 5000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon = document.createElement("i");
  if (type === "success") icon.className = "fas fa-check-circle";
  else if (type === "error") icon.className = "fas fa-exclamation-circle";
  else icon.className = "fas fa-info-circle";

  toast.appendChild(icon);

  const text = document.createElement("span");
  text.textContent = message;
  toast.appendChild(text);

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.5s forwards";
    toast.addEventListener("animationend", () => toast.remove());
  }, duration);
}
