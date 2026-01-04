const API_BASE = "https://buzzink.onrender.com";
const API_URL = `/api/posts`;
const AUTH_URL = `/api/auth`;
const COMMENTS_URL = `/api/comments`;
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobileMenu");
const searchIcon = document.querySelector(".search-icon");
const mobileSearch = document.getElementById("mobileSearch");
const logo = document.querySelector(".logo");
const allPostsBtn = document.querySelector(".all-posts-btn");
const myPosts = document.getElementById("myPosts");
const search = document.querySelectorAll(".search");
const postImages = document.querySelectorAll(".post-image");
const DEFAULT_AVATAR = "https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png";
document.getElementById("canonicalUrl")?.setAttribute("href", window.location.href);

// Set meta tags for SEO and social sharing
if (window.location.pathname.endsWith("post.html")) {
  (async () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    if (!slug) return;

    const res = await apiFetch(`/api/posts/${slug}`);
    const post = await res.json();

    document.title = `${post.title} | BuzzInk`;

    const desc = post.content.slice(0, 160);

    document.getElementById("postTitle")?.setAttribute("content", post.title);
    document.getElementById("postDescription")?.setAttribute("content", desc);
    document.getElementById("ogTitle")?.setAttribute("content", post.title);
    document.getElementById("ogDescription")?.setAttribute("content", desc);
    document.getElementById("ogImage")?.setAttribute("content", post.image || "/Images/fallback.jpg");
    document.getElementById("ogUrl")?.setAttribute("content", window.location.href);
    document.getElementById("twitterTitle")?.setAttribute("content", post.title);
    document.getElementById("twitterDescription")?.setAttribute("content", desc);
    document.getElementById("twitterImage")?.setAttribute("content", post.image || "/Images/fallback.jpg");
  })();
}

// Normalize user object
function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id
  };
}

// Get current user from localStorage
window.currentUser = (() => {
  const stored = localStorage.getItem("user");
  return stored ? normalizeUser(JSON.parse(stored)) : null;
})();

async function updateAvatar(user) {
  try {
    const res = await apiFetch("/api/users/me");

    if (!res.ok) return;

    user = await res.json();

    const avatars = document.querySelectorAll(".user-icon");
    if (avatars) {
      avatars.forEach(avatar => {
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

// Navigation handlers
logo?.addEventListener("click", () => {
  window.location.href = "index.html";
});

allPostsBtn?.addEventListener("click", () => {
  window.location.href = "all-posts.html";
});

myPosts?.addEventListener("click", () => {
  window.location.href = "my-posts.html";
});

// Mobile search toggle
searchIcon?.addEventListener("click", () => {
  mobileSearch.classList.toggle("show");
  if (mobileSearch.classList.contains("show")) {
    mobileSearch.querySelector("input").focus();
  }
});

// Menu toggle for mobile
menuToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (userMenuDetails.classList.contains("show")) {
    userMenuDetails.classList.remove("show");
  }
  mobileMenu.classList.toggle("active");
});

// Clear editSlug on write.html if not editing
if (window.location.pathname.endsWith("write.html") && !localStorage.getItem("editSlug")) {
  localStorage.removeItem("editSlug");
}

// Post management
let posts = [];
let currentPage = 1;
let totalPages = 1;

// Render no results message
function renderNoResults(container) {
  container.innerHTML = `<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">No results found...</p>`;
}

// Render no posts message for author
function renderNoAuthorPost(container) {
  container.innerHTML = `<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`;
}

// Get full image URL
// function getImageUrl(path) {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   return `${API_BASE}${path}`;
// }

function getImageUrl(image) {
  if (!image) return "/Images/fallback.jpg";

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return "/Images/fallback.jpg";
  }

  return "/Images/fallback.jpg";
}

// Fetch posts with pagination
async function fetchPosts(page = 1, limit = 6) {
  try {
    const res = await apiFetch(`${API_URL}?page=${page}&limit=${limit}`);
    const data = await res.json();

    posts = Array.isArray(data.posts) ? data.posts : [];
    currentPage = data.currentPage;
    totalPages = data.totalPages;

    refreshPage();
    renderPagination();
  } catch (err) {
    console.error("Error fetching posts:", err);
    showToast("Failed to load posts!", "error");
  }
}

// Fetch posts created by the logged-in user
async function fetchMyPosts(page = 1, limit = 6) {
  try {
    const res = await apiFetch(`${API_URL}/mine?page=${page}&limit=${limit}`);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch your posts");
    }

    const data = await res.json();

    posts = Array.isArray(data.posts) ? data.posts : [];
    currentPage = data.currentPage || 1;
    totalPages = data.totalPages || 1;

    const containerId = "myPostsContainer";
    displayPosts(containerId);
    renderPagination();
    if (posts.length === 0) {
      const container = document.getElementById("myPostsContainer");
      if (container) renderNoAuthorPost(container);
    }

  } catch (err) {
    console.error("Error fetching my posts:", err);
    showToast("Failed to load your posts!", "error");
  }
}

// Display posts in specified container
function displayPosts(containerId, limit = null) {
  const userId = window.currentUser?._id || window.currentUser?.id;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  let displayList = [...posts];

  if (containerId === "allPostsContainer") {
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      const selectedCategory = categoryFilter?.value;
      if (selectedCategory !== "all") {
        displayList = displayList.filter((post) => post.category === selectedCategory);
      }
    }
  }

  if (containerId === "myPostsContainer" && userId) {
    displayList = displayList.filter((post) => {
      const postAuthorId =
        typeof post.authorId === "object" && post.authorId !== null
          ? post.authorId._id
          : post.authorId;

      return String(postAuthorId) === String(userId);
    });
  }

  if (limit) displayList = displayList.slice(0, limit);

  if (displayList.length === 0) {
    renderNoResults(container);
    return;
  }

  displayList.forEach((post) => {
    const div = document.createElement("div");
    div.classList.add("post");

    const preview = post.content.length > 150
      ? post.content.substring(0, 150) + "..."
      : post.content;

    const postAuthorId =
      typeof post.authorId === "object" && post.authorId !== null
        ? post.authorId._id
        : post.authorId;

    const isAuthor =
      userId && String(postAuthorId) === String(userId);

    div.innerHTML = `
      ${post.image
        ? `<a href="post.html?slug=${post.slug}">
             <img src="${getImageUrl(post.image)}" alt="${post.title}" class="post-image" loading="lazy">
           </a>`
        : ""}
        <p class="tag">${post.category}</p>
        <h2>
          <a href="post.html?slug=${post.slug}" class="post-link">${post.title}</a>
        </h2>
        <p>${preview} <a href="post.html?slug=${post.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?user=${post.authorName}" class="author"><em>By ${post.authorName || "Unknown"}</em></a>
        <small>${new Date(post.date).toLocaleString()}</small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${post.likedByUser ? "liked" : ""}" data-post-id="${post._id}">
              <i class="${post.likedByUser ? "fa-solid" : "fa-regular"} fa-heart"></i>
              <span class="like-count">${post.likesCount || 0}</span>
            </button>
            <button class="comment-btn" data-post-id="${post._id}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${post.commentsCount || 0}</span>
            </button>
            <button class="share-btn">
              <i class="fa-solid fa-share"></i>
              <span class="share-count"></span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${isAuthor ? `
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${post.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${post.slug}">Delete</button>
        </div>
        ` : ""}
    `;
    container.appendChild(div);

    const img = div.querySelector(".post-image");
    if (img) {
      img.onerror = function () {
        this.onerror = null;
        this.src = "/Images/fallback.jpg";
      };
    }

    const likeBtn = div.querySelector(".like-btn");
    const heart = likeBtn.querySelector("i");
    const likedByEl = div.querySelector(".liked-by");

    const likedByIds = Array.isArray(post.likes)
      ? post.likes.map(l => (typeof l === "object" ? l._id : l))
      : [];

    if (userId && (likedByIds.includes(userId) || post.likedByUser)) {
      likeBtn.classList.add("liked");
      heart.className = "fa-solid fa-heart";
    } else {
      likeBtn.classList.remove("liked");
      heart.className = "fa-regular fa-heart";
    }

    if (!post.likedBy || post.likedBy.length === 0) {
      likedByEl.textContent = "No likes yet";
    } else if (post.likedBy.length === 1) {
      likedByEl.textContent = `Liked by ${post.likedBy[0]}`;
    } else {
      likedByEl.textContent = `Liked by ${post.likedBy[0]} and ${post.likedBy.length - 1} others`;
    }

    const commentCountSpan = div.querySelector(".comment-count");

    updateCommentCount(post._id, commentCountSpan);
  });
}

// Add a new post
async function addPost(title, content, category, imageFile) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);
  if (imageFile) formData.append("image", imageFile);

  const res = await apiFetch(`${API_URL}`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Failed to add post");
  return await res.json();
}

// Delete a post
async function deletePost(slug) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await apiFetch(`${API_URL}/${slug}`, { method: "DELETE" });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to delete post");
    }

    showToast("Post deleted successfully!", "success");
    if (window.location.pathname.endsWith("my-posts.html")) {
      fetchMyPosts(currentPage);
    } else {
      fetchPosts(currentPage);
    }
  } catch (err) {
    console.error("Error deleting post:", err);
    showToast("Failed to delete post!", "error");
  }
}

// Edit a post
function editPost(slug) {
  localStorage.removeItem("editSlug");
  localStorage.setItem("editSlug", slug);
  window.location.href = "write.html";
}

// Handle post form for adding/editing posts
const postForm = document.getElementById("postForm");
if (postForm) {
  const editSlug = localStorage.getItem("editSlug");

  if (editSlug && editSlug !== "null") {
    (async () => {
      try {
        const res = await apiFetch(`${API_URL}/${editSlug}`);
        if (!res.ok) throw new Error("Post not found");
        const post = await res.json();

        document.getElementById("title").value = post.title || "";
        document.getElementById("content").value = post.content || "";
        document.getElementById("category").value = post.category || "";

        if (post.image) {
          const imgPreview = document.getElementById("imagePreview");
          imgPreview.src = post.image;
          imgPreview.style.display = "block";
        }
      } catch (err) {
        console.error("Error loading post:", err);
      }
    })();

    postForm.onsubmit = async function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", document.getElementById("title").value);
      formData.append("content", document.getElementById("content").value);
      formData.append("category", document.getElementById("category").value);

      const imageFile = document.getElementById("image").files[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      try {
        const res = await apiFetch(`${API_URL}/${editSlug}`, {
          method: "PUT",
          body: formData,
        });

        if (res.ok) {
          showToast("Post updated successfully!", "success");
          localStorage.removeItem("editSlug");
          window.location.href = "all-posts.html";
        } else {
          console.error("Update failed:", await res.text());
        }
      } catch (err) {
        console.error("Error updating post:", err);
        showToast("Failed to update post!", "error");
      }
    };
  } else {
    localStorage.removeItem("editSlug");
    postForm?.addEventListener("submit", async function (e) {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const category = document.getElementById("category").value;
      const imageFile = document.getElementById("image").files[0];

      console.log("Submitting new post:", { title, content, category, imageFile });

      try {
        const newPost = await addPost(title, content, category, imageFile);
        console.log("Post created successfully!", newPost);
        showToast("Post created successfully!", "success");
        postForm.reset();
        window.location.href = "all-posts.html";
        localStorage.removeItem("editSlug");
      } catch (err) {
        console.error("Error adding post:", err);
        showToast("Failed to add post!", "error");
      }
    });
  };
}

// Refresh posts display
function refreshPage() {
  if (document.getElementById("allPostsContainer")) {
    displayPosts("allPostsContainer");
  }
  if (document.getElementById("featuredPostsContainer")) {
    displayPosts("featuredPostsContainer", 3);
  }
  if (document.getElementById("myPostsContainer")) {
    displayPosts("myPostsContainer");
  }
}

// Category filter change handling
document.getElementById("categoryFilter")?.addEventListener("change", () => {
  displayPosts("allPostsContainer");
});

// Search posts functionality
function searchPosts(e) {
  const searchValue = e.target.value.toLowerCase() || "";
  const containerId = document.getElementById("allPostsContainer")
    ? "allPostsContainer"
    : "featuredPostsContainer";
  const container = document.getElementById(containerId);
  if (!container) return;

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchValue) ||
      post.content.toLowerCase().includes(searchValue) ||
      post.category.toLowerCase().includes(searchValue)
  );

  container.innerHTML = "";

  if (filteredPosts.length === 0) {
    renderNoResults(container);
    return;
  }

  filteredPosts.forEach((post) => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      ${post.image
        ? `<img src="${getImageUrl(post.image)}" alt="${post.title}" class="post-image" loading="lazy">`
        : ""}
      <div class="post-content">
        <p class="tag">${post.category}</p>
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><em>By ${post.authorName || "Unknown"}</em></p>
        <small>${new Date(post.date).toLocaleString()}</small>
      </div>
    `;
    container.appendChild(div);

    const img = div.querySelector(".post-image");
    if (img) {
      img.onerror = function () {
        this.onerror = null;
        this.src = "/Images/fallback.jpg";
      };
    }
    div.addEventListener("click", () => {
      window.location.href = `post.html?slug=${post.slug}`;
    });
  });

  if (searchValue === "") {
    refreshPage();
  }
}

search.forEach(input => input.addEventListener("keyup", searchPosts));

// Render pagination buttons
function renderPagination() {
  const container = document.getElementById("pagination");
  if (!container) return;
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "pg-active" : "";
    btn?.addEventListener("click", () => fetchPosts(i));
    container.appendChild(btn);
  }
}

// Authentication and UI management
const userIcon = document.querySelectorAll(".user-icon");
const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const writePostBtns = document.querySelectorAll(".write-post");
const userMenuDetails = document.getElementById("userMenuDetails");
const logoutBtn = document.getElementById("logoutBtn");

// User icon click to toggle menu or show auth modal
userIcon.forEach(icon => icon?.addEventListener("click", () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user && user.id) {
    userMenuDetails.classList.toggle("show");
    authModal.classList.add("hidden");
  } else {
    userMenuDetails.classList.add("hidden");
    authModal.classList.remove("hidden");
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    loginForm?.reset();
    registerForm?.reset();
  }
}));

// Close menus/modals on outside click
document.addEventListener("click", (e) => {
  if (
    userMenuDetails?.classList.contains("show") &&
    !userMenuDetails.contains(e.target) &&
    ![...userIcon].some(icon => icon.contains(e.target))
  ) {
    userMenuDetails.classList.remove("show");
  }

  if (
    mobileMenu?.classList.contains("active") &&
    !mobileMenu.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    mobileMenu.classList.remove("active");
  }
});

// Close auth modal
closeModal?.addEventListener("click", () => {
  authModal.classList.add("hidden");
});

// Switch between login and register tabs
loginTab?.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
});
registerTab?.addEventListener("click", () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
});

// Write post button click handling
writePostBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.id) {
      e.preventDefault();
      authModal.classList.remove("hidden");
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    } else {
      localStorage.removeItem("editSlug");
      window.location.href = "write.html";
    }
  });
});

// Login form submission
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  console.log("Login Triggered");

  const res = await apiFetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log("Login response:", data);

  if (!res.ok) {
    showToast(`Login failed: ${data.message || "Unknown error"}`, "error");
  }

  const user = normalizeUser(data.user);
  localStorage.setItem("token", data.token);
  localStorage.setItem("refreshToken", data.refreshToken)
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

// Register form submission
registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const res = await apiFetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  console.log("Register response:", data);

  if (!res.ok) {
    showToast(`Registration failed: ${data.message || "Unknown error"}`, "error");
  }

  const user = normalizeUser(data.user);
  localStorage.setItem("token", data.token);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(user));
  window.currentUser = user;
  localStorage.setItem("role", user.role);
  updateUI(user);
  updateAvatar(user);
  authModal.classList.add("hidden");
  registerForm.reset();
  showToast(`Welcome, ${user.name}! Your account has been created.`, "success");
});

// Logout function
function logout(silent = false) {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.currentUser = null;
  updateUI(null);

  if (!silent) showToast("You have been logged out.", "info");
}

// Logout button handling
logoutBtn?.addEventListener("click", () => {
  logout();
  window.location.href = "index.html";
});

// Check user authentication status on page load
async function checkUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    updateUI(null);
    updateAvatar(null);
    return null;
  }

  try {
    const res = await apiFetch(`${AUTH_URL}/me`);

    if (!res.ok) throw new Error("Not authenticated");

    const data = await res.json();
    const user = normalizeUser(data.user);

    localStorage.setItem("user", JSON.stringify(user));
    window.currentUser = user;
    updateUI(user);
    updateAvatar(user);

    return user;

  } catch {
    logout(true);
    return null;
  }
}

// Update UI based on user status
function updateUI(user) {
  if (user?.id) {
    userIcon.forEach(icon => icon.title = `Logged in as ${user.name}`);
  } else {
    userIcon.forEach(icon => icon.title = "Click to Login/Register");
    userMenuDetails?.classList.remove("show");
  }
}

// Generic API fetch with token refresh
async function apiFetch(url, options = {}) {
  let token = localStorage.getItem("token");

  if (!options.headers) options.headers = {};
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = url;

  let res = await fetch(fullUrl, {
    credentials: "include",
    ...options
  });

  if (res.status === 401) {
    token = await refreshToken();
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
      res = await fetch(fullUrl, {
        credentials: "include",
        ...options
      });
    }
  }
  
  return res;
}

// Refresh token function
async function refreshToken() {
  const storedRefreshToken = localStorage.getItem("refreshToken");
  if (!storedRefreshToken) return null;

  try {
    const res = await fetch(`${AUTH_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: storedRefreshToken })
    });

    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

    const user = normalizeUser(data.user);
    localStorage.setItem("user", JSON.stringify(user));
    window.currentUser = user;
    updateUI(user);

    return data.token;

  } catch (err) {
    return null;
  }
}

// Toast notification function
function showToast(message, type = "info", duration = 5000) {
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

// Like Btn Handler
async function handleLike(btn) {
  const postId = btn.dataset.postId;
  const heart = btn.querySelector("i");
  const countEl = btn.querySelector(".like-count");
  const likedByEl = btn.closest(".post-interactions-container")?.querySelector(".liked-by");


  const alreadyLiked = btn.classList.contains("liked");
  const token = localStorage.getItem("token");
  const refresh = localStorage.getItem("refreshToken");
  if (!token && !refresh) {
    showToast("Please log in to like or unlike posts.", "error");
    return;
  }

  try {
    let res;
    if (alreadyLiked) {
      res = await apiFetch(`/api/posts/${postId}/unlike`, { method: "POST" });
    } else {
      res = await apiFetch(`/api/posts/${postId}/like`, { method: "POST" });
    }

    const data = await res.json();

    if (res.ok) {
      if (alreadyLiked) {
        btn.classList.remove("liked");
        heart.className = "fa-regular fa-heart";
      } else {
        btn.classList.add("liked");
        heart.className = "fa-solid fa-heart";
      }

      countEl.textContent = data.likes ?? 0;

      if (data.likedBy && data.likedBy.length > 0) {
        if (data.likedBy.length === 1) {
          likedByEl.textContent = `Liked by ${data.likedBy[0]}`;
        } else {
          likedByEl.textContent = `Liked by ${data.likedBy[0]} and ${data.likedBy.length - 1} others`;
        }
      } else {
        likedByEl.textContent = "No likes yet";
      }
    } else {
      showToast(`Failed to update likes: ${data.message}`, "error");
    }
  } catch (err) {
    console.error("Like action failed:", err);
    showToast("Error updating like. Please try again.", "error");
  }
}

// Toggle comments section
async function toggleComments(commentBtn) {
  const postId = commentBtn.dataset.postId

  if (!postId) return;

  const isSinglePost = window.location.pathname.endsWith("post.html");

  const postElement = isSinglePost
    ? document.getElementById("singlePostContainer")
    : commentBtn.closest(".post");
  if (!postElement) return;

  const commentsSection = postElement.querySelector(".comments-section");
  const commentsList = commentsSection?.querySelector(".comments-list");

  if (!commentsSection || !commentsList) return;

  if (!isSinglePost) {
    commentsSection.classList.toggle("show");
  }

  if (isSinglePost || commentsSection.classList.contains("show")) {
    await fetchComments(postId, commentsList);
  }
}

// Delete comment handler
async function handleDeleteComment(deleteBtn) {
  if (deleteBtn.dataset.deleting === "true") return;
  deleteBtn.dataset.deleting = "true";
  const commentId = deleteBtn.dataset.commentId;
  const confirmDelete = confirm("Are you sure you want to delete this comment?");
  if (!confirmDelete) {
    deleteBtn.dataset.deleting = "false";
    return;
  };

  try {
    const res = await apiFetch(`${COMMENTS_URL}/${commentId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      const commentEl = deleteBtn.closest(".comment");
      if (commentEl) commentEl.remove();

      let commentCountSpan;

      if (window.location.pathname.endsWith("post.html")) {
        const postElement = document.getElementById("singlePostContainer");
        commentCountSpan = postElement?.querySelector(".comment-count");
      } else {
        const postElement = deleteBtn.closest(".post");
        commentCountSpan = postElement?.querySelector(".comment-count");
      }

      if (commentCountSpan) {
        const currentCount = parseInt(commentCountSpan.textContent) || 0;
        commentCountSpan.textContent = Math.max(0, currentCount - 1);
      }
      showToast("Comment deleted successfully!", "success");
    } else {
      throw new Error(data.message || "Delete failed");
    }
  } catch (err) {
    console.error("Error deleting comment:", err);
    showToast("Error deleting comment. Please try again.", "error");
  } finally {
    deleteBtn.dataset.deleting = "false";
  }
}

// Global event handlers
document.addEventListener("click", async (e) => {
  // Edit post handling
  const editBtn = e.target.closest(".edit-btn");
  if (editBtn) {
    e.preventDefault();
    e.stopPropagation();
    editPost(editBtn.dataset.slug);
    return;
  }

  // Delete post handling
  const deletePostBtn = e.target.closest(".delete-btn");
  if (deletePostBtn) {
    e.preventDefault();
    e.stopPropagation();
    deletePost(deletePostBtn.dataset.slug);
    return;
  }

  // Like button handling
  const likeBtn = e.target.closest(".like-btn");
  if (likeBtn) {
    e.preventDefault();
    handleLike(likeBtn);
    return;
  };

  // Comment button handling
  const commentBtn = e.target.closest(".comment-btn");
  if (commentBtn) {
    e.preventDefault();
    toggleComments(commentBtn);
    return;
  };

  // Delete comment handling
  const deleteBtn = e.target.closest(".delete-comment-btn");
  if (deleteBtn) {
    e.preventDefault();
    e.stopPropagation();
    handleDeleteComment(deleteBtn);
  }

  // Menu button handling
  const menuBtn = e.target.closest(".menu-btn");
  const options = e.target.closest(".menu-options");

  // Close all menus if clicking elsewhere
  if (!menuBtn && !options) {
    document.querySelectorAll(".menu-options").forEach(opt => opt.classList.add("hidden"));
    return;
  }

  if (menuBtn) {
    const menu = menuBtn.nextElementSibling;
    menu.classList.toggle("hidden");
  }
});

// Comment form submission
document.addEventListener("submit", async (e) => {
  const commentForm = e.target.closest(".comment-form");
  if (!commentForm) return;
  e.preventDefault();

  const commentInput = commentForm.querySelector(".comment-input");
  const commentText = commentInput.value.trim();
  if (!commentText) return;

  let postElement;
  let commentsList;
  let postId;
  let commentCountSpan;

  if (window.location.pathname.endsWith("post.html")) {
    postElement = document.getElementById("singlePostContainer");
    commentsList = postElement.querySelector(".comments-list");
    postId = postElement.querySelector(".comment-btn").dataset.postId;
    commentCountSpan = postElement.querySelector(".comment-count");
  } else {
    postElement = commentForm.closest(".post");
    commentsList = postElement.querySelector(".comments-list");
    postId = postElement.querySelector(".like-btn").dataset.postId;
    commentCountSpan = postElement.querySelector(".comment-count");
  }

  if (!window.currentUser || !localStorage.getItem("token")) {
    showToast("Please log in to comment.", "error");
    commentInput.value = "";
    return;
  }

  await postComment(postId, commentText, commentsList, commentCountSpan);
  commentInput.value = "";

});

// Comments functionality
async function fetchComments(postId, commentsList, limit = 3) {
  try {
    commentsList.innerHTML = `<p class="loading-comments">Loading comments...</p>`;

    const res = await apiFetch(`${COMMENTS_URL}/post/${postId}?_=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to fetch comments");

    const comments = await res.json();

    commentsList.innerHTML = "";

    if (comments.length === 0) {
      commentsList.innerHTML = "<p class='no-comments'>No comments yet. Be the first to comment!</p>";
      return;
    }

    const limitedComments = comments.slice(0, limit);
    renderComments(limitedComments, commentsList);

    if (comments.length > limit) {
      const toggleBtn = document.createElement("button");
      toggleBtn.classList.add("view-more-btn");
      toggleBtn.textContent = `View all ${comments.length} comments`;

      const fullContainer = document.createElement("div");
      fullContainer.classList.add("comments-scroll-container");
      fullContainer.style.display = "none";
      renderComments(comments, fullContainer);

      let expanded = false;

      toggleBtn.addEventListener("click", () => {
        expanded = !expanded;
        if (expanded) {
          commentsList.innerHTML = "";
          commentsList.appendChild(fullContainer);
          commentsList.appendChild(toggleBtn);
          fullContainer.style.display = "block";
          toggleBtn.textContent = "View less comments";
        } else {
          commentsList.innerHTML = "";
          renderComments(limitedComments, commentsList);
          toggleBtn.textContent = `View all ${comments.length} comments`;
          commentsList.appendChild(toggleBtn);
        }
      });
      commentsList.appendChild(toggleBtn);
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
    commentsList.innerHTML = "<p class='error-comments'>Failed to load comments.</p>";
  }
}

function renderComments(comments, commentsList) {
  const currentUserId = window.currentUser?.id || window.currentUser?._id;
  comments.forEach((comment) => {
    const div = document.createElement("div");
    div.classList.add("comment");

    const commentAuthorId =
      typeof comment.authorId === "object"
        ? comment.authorId._id
        : comment.authorId;

    const isOwner =
      currentUserId &&
      commentAuthorId &&
      commentAuthorId.toString() === currentUserId.toString();

    div.innerHTML = `
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${comment.authorId?.name || "Anonymous"}:</strong> ${comment.text}</p>
        ${isOwner
        ? `<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${comment._id}">Delete</button>
                  </div>
                </div>`
        : ""
      }
      </div>  
      <small>${new Date(comment.createdAt).toLocaleString()}</small>
    `;
    commentsList.appendChild(div);

    const commentAuthor = div.querySelector(".comment-author");
    commentAuthor?.addEventListener("click", () => {
      window.location.href = `profile.html?user=${comment.authorId?.name}`;
    });
  });
}

async function postComment(postId, text, commentsList, commentCountSpan) {
  try {
    const token = localStorage.getItem("token");

    const res = await apiFetch(`${COMMENTS_URL}/post/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const newComment = await res.json();
      const div = document.createElement("div");
      div.classList.add("comment");
      div.innerHTML = `
        <div class="comment-header">
          <p><strong>You:</strong> ${newComment.text}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${newComment._id}">Delete</button>
            </div>
          </div>
        </div>
        <small>${new Date(newComment.createdAt).toLocaleString()}</small>
      `;
      commentsList.prepend(div);
      if (commentCountSpan) {
        await updateCommentCount(postId, commentCountSpan);
      }

      showToast("Comment posted successfully!", "success");
    } else {
      throw new Error("Failed to post comment");
    }
  } catch (err) {
    console.error("Error posting comment:", err);
    showToast("Failed to post comment", "error");
  }
}

// Update comment count for a post
async function updateCommentCount(postId, commentCountSpan) {
  try {
    const res = await apiFetch(`${COMMENTS_URL}/post/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch comment count");

    const comments = await res.json();
    const count = comments.length;

    if (count === 0) {
      commentCountSpan.textContent = "0";
      commentCountSpan.title = "No comments yet";
    } else {
      commentCountSpan.textContent = count;
      commentCountSpan.title = `${count} comment${count > 1 ? "s" : ""}`;
    }
  } catch (err) {
    console.error("Error fetching comment count:", err);
    commentCountSpan.textContent = "0";
  }
}

// Inject JSON-LD structured data for SEO
function injectPostJsonLd(post) {
  const oldScript = document.getElementById("post-jsonld");
  if (oldScript) oldScript.remove();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.content.slice(0, 160),
    "image": post.image ? [post.image] : [],
    "author": {
      "@type": "Person",
      "name": post.authorName || "BuzzInk Contributor"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BuzzInk",
      "logo": {
        "@type": "ImageObject",
        "url": "https://buzzink.onrender.com/Images/logo.png"
      }
    },
    "datePublished": post.createdAt || post.date,
    "dateModified": post.updatedAt || post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "post-jsonld";
  script.textContent = JSON.stringify(jsonLd);

  document.head.appendChild(script);
}


// Load single post details
async function loadSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const postSlug = params.get("slug");

  if (!postSlug) return;

  try {
    const res = await apiFetch(`${API_URL}/${postSlug}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    const post = await res.json();

    const userId = window.currentUser?._id || window.currentUser?.id;

    const postAuthorId =
      typeof post.authorId === "object" && post.authorId !== null
        ? post.authorId._id
        : post.authorId;

    const isAuthor =
      userId && String(postAuthorId) === String(userId);

    const container = document.getElementById("singlePostContainer");

    container.innerHTML = `
      ${post.image ? `<img src="${getImageUrl(post.image)}" alt="${post.title}" class="post-image" loading="lazy">` : ""}
      <h1>${post.title}</h1>
      <p class="tag">${post.category}</p>
      <p onclick="window.location.href='profile.html?user=${post.authorName}'" style="cursor: pointer;"><em>By ${post.authorName || "Unknown"}</em></p>
      <small>${new Date(post.date).toLocaleString()}</small>
      <div class="content">
        <p>${post.content}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${post.likedByUser ? "liked" : ""}" data-post-id="${post._id}">
            <i class="${post.likedByUser ? "fa-solid" : "fa-regular"} fa-heart"></i>
            <span class="like-count">${post.likesCount || 0}</span>
          </button>
          <button class="comment-btn" data-post-id="${post._id}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${post.commentsCount || 0}</span>
          </button>
          <button class="share-btn">
            <i class="fa-solid fa-share"></i>
            <span class="share-count"></span>
          </button>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div class="comments-section show">
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Write a comment..." required />
          <button type="submit">Comment</button>
        </form>
        <div class="comments-list"></div>
      </div>
      ${isAuthor ? `
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${post.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${post.slug}">Delete</button>
      </div>` : ""}
    `;

    const img = container.querySelector(".post-image");
    if (img) {
      img.onerror = function () {
        this.onerror = null;
        this.src = "/Images/fallback.jpg";
      };
    }

    const likeBtn = container?.querySelector(".like-btn");
    const heart = likeBtn?.querySelector("i");
    const likedByEl = container?.querySelector(".liked-by");

    const likedByIds = Array.isArray(post.likes)
      ? post.likes.map(l => (typeof l === "object" ? l._id : l))
      : [];

    if (userId && (likedByIds.includes(userId) || post.likedByUser)) {
      likeBtn.classList.add("liked");
      heart.className = "fa-solid fa-heart";
    } else {
      likeBtn.classList.remove("liked");
      heart.className = "fa-regular fa-heart";
    }

    if (!post.likedBy || post.likedBy.length === 0) {
      likedByEl.textContent = "No likes yet";
    } else if (post.likedBy.length === 1) {
      likedByEl.textContent = `Liked by ${post.likedBy[0]}`;
    } else {
      likedByEl.textContent = `Liked by ${post.likedBy[0]} and ${post.likedBy.length - 1} others`;
    }

    const commentCountSpan = container.querySelector(".comment-count");
    updateCommentCount(post._id, commentCountSpan);

    const commentsSection = document.querySelector(".comments-section");
    const commentsList = commentsSection.querySelector(".comments-list");

    if (commentsSection && commentsList) {
      await fetchComments(post._id, commentsList, Infinity);
    }

    injectPostJsonLd(post);
  } catch (err) {
    console.error(err);
    document.getElementById("singlePostContainer").innerHTML = "<p>Error loading post.</p>";
  }
}

// Fetch and display trending posts
const fetchTrendingPosts = async () => {
  const res = await apiFetch(`${API_URL}/trending?limit=5`);
  const data = await res.json();

  const trendingList = document.getElementById("trending-list");
  trendingList.innerHTML = data.map((post, index) => {
    const rankIcons = ["🥇", "🥈", "🥉"];
    const rankDisplay = rankIcons[index] || `#${index + 1}`;
    return `
    <li>
      <span class="trending-rank">${rankDisplay}</span>
      <a href="post.html?slug=${post.slug}" class="trending-title">${post.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `}).join("");
};


// Profile edit button handling
const profileEdit = document.getElementById("profile-edit");
profileEdit?.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Forgot password modal and form handling
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
}

// Initial user check
document.addEventListener("DOMContentLoaded", async () => {
  const user = await checkUser();
  window.currentUser = user;

  await updateAvatar(user);

  initForgotPassword();

  if (window.location.pathname.endsWith("index.html")) {
    fetchPosts();
    fetchTrendingPosts();
  } else if (window.location.pathname.endsWith("my-posts.html")) {
    fetchMyPosts();
  } else if (window.location.pathname.endsWith("post.html")) {
    loadSinglePost();
  } else {
    fetchPosts();
  }
  refreshPage();
});

export { showToast, apiFetch };