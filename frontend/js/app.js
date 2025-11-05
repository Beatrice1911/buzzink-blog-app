const API_URL = "http://localhost:5000/api/posts";
const AUTH_URL = "http://localhost:5000/api/auth";
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobileMenu");
const searchIcon = document.querySelector(".search-icon");
const mobileSearch = document.getElementById("mobileSearch");

// Mobile search toggle
searchIcon?.addEventListener("click", () => {
  mobileSearch.classList.toggle("show");
});

// Menu toggle for mobile
menuToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (userMenuDetails.classList.contains("show")) {
    userMenuDetails.classList.remove("show");
  }
  mobileMenu.classList.toggle("active");
});

// Clear editId on write.html if not editing
if (window.location.pathname.endsWith("write.html") && !localStorage.getItem("editId")) {
  localStorage.removeItem("editId");
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
function getImageUrl(path) {
  if (!path) return "";
  return path.startsWith("http") ? path : `http://localhost:5000${path}`;
}

// Fetch posts with pagination
async function fetchPosts(page = 1, limit = 6) {
  try {
    const res = await apiFetch(`${API_URL}?page=${page}&limit=${limit}`);
    const data = await res.json();

    posts = data.posts;
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

    posts = data.posts || [];
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

// Initial fetch based on page
if (window.location.pathname.endsWith("my-posts.html")) {
  fetchMyPosts();
}

const token = localStorage.getItem("token");
console.log(token);

// Display posts in specified container
function displayPosts(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const loggedInUser = localStorage.getItem("user");
  const user = loggedInUser ? JSON.parse(loggedInUser) : null;

  let displayList = [...posts];

  if (containerId === "allPostsContainer") {
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      const selectedCategory = categoryFilter.value;
      if (selectedCategory !== "all") {
        displayList = displayList.filter((post) => post.category === selectedCategory);
      }
    }
  }

  if (containerId === "myPostsContainer" && user) {
    displayList = displayList.filter(post => post.authorId === user.id);
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
    const isAuthor = user && user.id === post.authorId;
    div.innerHTML = `
      ${post.image
        ? `<a href="post.html?id=${post._id}">
             <img src="${getImageUrl(post.image)}" alt="${post.title}">
           </a>`
        : ""}
        <p class="tag">${post.category}</p>
        <h2>
          <a href="post.html?id=${post._id}" class="post-link">${post.title}</a>
        </h2>
        <p>${preview} <a href="post.html?id=${post._id}" class="read-more">Read more</a></p>
        <a href="profile.html?user=${post.authorName}" class="author"><em>By ${post.authorName || "Unknown"}</em></a>
        <small>${new Date(post.date).toLocaleString()}</small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${post.likedByUser ? "liked" : ""}" data-post-id="${post._id}">
              <i class="${post.likedByUser ? "fa-solid" : "fa-regular"} fa-heart"></i>
              <span class="like-count">${post.likesCount || 0}</span>
            </button>
            <button class="comment-btn">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count"></span>
            </button>
            <button class="share-btn">
              <i class="fa-solid fa-share"></i>
              <span class="share-count"></span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        ${isAuthor ? `
        <div class="post-actions">
            <button onclick="editPost('${post._id}')" class="edit-btn btn">Edit</button>
            <button onclick="deletePost('${post._id}')" class="delete-btn btn">Delete</button>
        </div>
        ` : ""}
    `;
    container.appendChild(div);

    const likeBtn = div.querySelector(".like-btn");
    const heart = likeBtn.querySelector("i");
    const likedByEl = div.querySelector(".liked-by");
    const userId = user?._id || user?.id;

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
  });
}

// Add a new post
async function addPost(title, content, category, imageFile) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);
  if (imageFile) formData.append("image", imageFile);

  const res = await apiFetch(`${API_BASE}/api/posts`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Failed to add post");
  return await res.json();
}

// Delete a post
async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });

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
function editPost(id) {
  localStorage.removeItem("editId");
  localStorage.setItem("editId", id);
  window.location.href = "write.html";
}

// Handle post form for adding/editing posts
const postForm = document.getElementById("postForm");
if (postForm) {
  const editId = localStorage.getItem("editId");

  if (editId && editId !== "null") {
    (async () => {
      try {
        const res = await apiFetch(`${API_URL}/${editId}`);
        if (!res.ok) throw new Error("Post not found");
        const post = await res.json();

        document.getElementById("title").value = post.title || "";
        document.getElementById("content").value = post.content || "";
        document.getElementById("category").value = post.category || "";

        if (post.image) {
          const imgPreview = document.getElementById("imagePreview");
          imgPreview.src = getImageUrl(post.image);
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
        const res = await apiFetch(`${API_URL}/${editId}`, {
          method: "PUT",
          body: formData,
        });

        if (res.ok) {
          showToast("Post updated successfully!", "success");
          localStorage.removeItem("editId");
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
    localStorage.removeItem("editId");
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
        localStorage.removeItem("editId");
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
}

// Category filter change handling
document.getElementById("categoryFilter")?.addEventListener("change", () => {
  displayPosts("allPostsContainer");
});

// Search posts functionality
function searchPosts() {
  const searchValue = document.getElementById("search")?.value.toLowerCase() || "";
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
        ? `<img src="${getImageUrl(post.image)}" alt="${post.title}">`
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
    div.onclick = () => {
      window.location.href = `post.html?id=${post._id}`;
    };
  });

  if (searchValue === "") {
    refreshPage();
  }
}

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
      localStorage.removeItem("editId");
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

  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log("Login response:", data);

  if (res.ok && data.token && data.refreshToken) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken)
    localStorage.setItem("user", JSON.stringify(data.user));
    showToast(`Welcome back, ${data.user.name}!`, "success");
    authModal.classList.add("hidden");
    updateUI(data.user);
    loginForm.reset();
    refreshPage();
  } else {
    showToast(`Login failed: ${data.message || "Unknown error"}`, "error");
  }
});

// Register form submission
registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  console.log("Register response:", data);

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showToast(`Welcome, ${data.user.name}! Your account has been created.`, "success");
    authModal.classList.add("hidden");
    updateUI(data.user);
    registerForm.reset();
  } else {
    showToast(`Registration failed: ${data.message || "Unknown error"}`, "error");
  }
});

// Logout button handling
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showToast("You have been logged out.", "info");
  updateUI(null);
  window.location.href = "index.html";
});

// Check user authentication status on page load
async function checkUser() {
  const savedUser = localStorage.getItem("user");
  if (savedUser) updateUI(JSON.parse(savedUser));

  const res = await apiFetch(`${AUTH_URL}/me`);
  const data = await res.json();

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    updateUI(data.user);
  } else {
    updateUI(null);
  }
}

// Update UI based on user status
function updateUI(user) {
  if (user && user.id) {
    userIcon.forEach(icon => icon.title = `Logged in as ${user.name}`);
    logoutBtn.classList.remove("hidden");
  } else {
    userIcon.forEach(icon => icon.title = "Click to Login/Register");
    userMenuDetails?.classList.remove("show");
  }
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

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      const userRes = await fetch(`${AUTH_URL}/me`, {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      if (userRes.ok) {
        const user = await userRes.json();
        localStorage.setItem("user", JSON.stringify(user));
        updateUI(user);
      }
      showToast("Session refreshed", "success");
      return data.token;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      updateUI(null);
      showToast("Session expired, please log in again", "error");
      return null;
    }
  } catch (err) {
    console.error("Refresh error:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    updateUI(null);
    return null;
  }
}

// Generic API fetch with token refresh
const API_BASE = "http://localhost:5000";

async function apiFetch(url, options = {}) {
  let token = localStorage.getItem("token");

  if (!options.headers) options.headers = {};
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  let res = await fetch(fullUrl, options);

  if (res.status === 401) {
    token = await refreshToken();
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
      res = await fetch(fullUrl, options);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "index.html";
      return res;
    }
  }

  return res;
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

// Like button handling
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".like-btn");
    if (!btn) return;
    e.preventDefault();

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
  });
});


// Load single post details
async function loadSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) return;

  try {
    const res = await apiFetch(`${API_URL}/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    const post = await res.json();

    const loggedInUser = localStorage.getItem("user");
    const user = loggedInUser ? JSON.parse(loggedInUser) : null;
    const isAuthor = user && user.id === post.authorId;

    document.getElementById("singlePostContainer").innerHTML = `
      ${post.image ? `<img src="${getImageUrl(post.image)}" alt="${post.title}">` : ""}
      <h1>${post.title}</h1>
      <p class="tag">${post.category}</p>
      <p onclick="window.location.href='post.html?id=${post._id}'" style="cursor: pointer;"><em>By ${post.authorName || "Unknown"}</em></p>
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
          <button class="comment-btn">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count"></span>
          </button>
          <button class="share-btn">
            <i class="fa-solid fa-share"></i>
            <span class="share-count"></span>
          </button>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      ${isAuthor ? `
      <div class="post-actions">
        <button onclick="editPost('${post._id}')" class="edit-btn btn">Edit</button>
        <button onclick="deletePost('${post._id}')" class="delete-btn btn">Delete</button>
      </div>` : ""}
    `;

    const container = document.getElementById("singlePostContainer");
    const likeBtn = container?.querySelector(".like-btn");
    const heart = likeBtn?.querySelector("i");
    const likedByEl = container?.querySelector(".liked-by");
    const userId = user?._id || user?.id;

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
  
  } catch (err) {
    console.error(err);
    document.getElementById("singlePostContainer").innerHTML = "<p>Error loading post.</p>";
  }
}

// Load single post if on post.html
if (window.location.pathname.includes("post.html")) {
  loadSinglePost();
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
      <a href="post.html?id=${post._id}" class="trending-title">${post.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `}).join("");
};

// Load featured and trending posts on index.html
if (window.location.pathname.endsWith("index.html")) {
  checkUser();
  fetchPosts();
  fetchTrendingPosts();
}

// Profile edit button handling
const profileEdit = document.getElementById("profile-edit");
profileEdit?.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Initial user check
document.addEventListener("DOMContentLoaded", () => {
  checkUser();
  refreshPage();
});

