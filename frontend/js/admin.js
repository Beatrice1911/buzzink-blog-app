import { apiFetch } from "./api.js";
import { showToast } from "./ui.js";
import { logout } from "./auth.js";
const logoutBtn = document.getElementById("logoutBtn");

async function checkAdmin() {
  try {
    const res = await apiFetch("/api/users/me");
    const user = await res.json();

    if (user.role !== "admin") return redirectHome();
  } catch (err) {
    redirectHome();
  }
}

function redirectHome() {
  alert("Access denied. Admins only.");
  window.location.href = "/index.html";
}

async function updateAvatar(user) {
  try {
    const res = await apiFetch("/api/users/me");

    if (!res.ok) return;

    user = await res.json();

    const adminAvatars = document.querySelectorAll(".avatar");
    if (adminAvatars) {
      adminAvatars.forEach((avatar) => {
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

let usersPage = 1;
let postsPage = 1;
let commentsPage = 1;
let messages = [];
let messagesPage = 1;
const MESSAGES_LIMIT = 8;

const LIMIT = 10;

// Select sidebar links and sections
const sidebarLinks = document.querySelectorAll(".sidebar .admin-nav-links a");
const sections = {
  overview: document.querySelector(".overview-cards"),
  users: document.getElementById("users-section"),
  posts: document.getElementById("posts-section"),
  comments: document.getElementById("comments-section"),
  messages: document.getElementById("messages-section"),
  settings: document.getElementById("settings-section"),
};

function showSection(sectionKey) {
  Object.values(sections).forEach((sec) => {
    if (sec) sec.style.display = "none";
  });

  sidebarLinks.forEach((link) => link.classList.remove("active"));

  const section = sections[sectionKey];
  if (section) {
    section.style.display = sectionKey === "overview" ? "flex" : "block";
  }

  const activeLink = document.querySelector(
    `.sidebar a[data-section="${sectionKey}"]`,
  );
  activeLink?.classList.add("active");

  if (sectionKey === "users") loadUsers();
  if (sectionKey === "posts") loadPosts();
  if (sectionKey === "comments") loadComments();
  if (sectionKey === "messages") loadMessages();
}

sidebarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    location.hash = section;
    showSection(section);
  });
});

function createRow(data, columns, type) {
  const tr = document.createElement("tr");

  columns.forEach((col) => {
    const td = document.createElement("td");
    td.textContent =
      data[col] !== undefined && data[col] !== null ? data[col] : "";
    tr.appendChild(td);
  });

  // Actions column
  const actionTd = document.createElement("td");

  if (type === "users") {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn-delete");
    deleteBtn.onclick = () => deleteUser(data._id, tr);
    actionTd.appendChild(deleteBtn);
  } else if (type === "posts") {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn-delete");
    deleteBtn.onclick = () => deletePost(data._id, tr);
    actionTd.appendChild(deleteBtn);
  } else if (type === "comments") {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn-delete");
    deleteBtn.onclick = () => deleteComment(data._id, tr);
    actionTd.appendChild(deleteBtn);
  }

  tr.appendChild(actionTd);
  return tr;
}

// Fetch and render Overview Stats
async function loadOverviewStats() {
  try {
    const res = await apiFetch("/api/admin/stats");
    const data = await res.json();

    document.getElementById("total-users").textContent = data.users;
    document.getElementById("total-posts").textContent = data.posts;
    document.getElementById("total-comments").textContent = data.comments;
    document.getElementById("total-messages").textContent = data.messages;
  } catch (err) {
    console.error("Failed to load overview stats:", err);
  }
}

// Search inputs
const userSearchInput = document.getElementById("user-search");
const postSearchInput = document.getElementById("post-search");
const commentSearchInput = document.getElementById("comment-search");

// Cache object
const cache = {
  users: { filtered: null },
  posts: { filtered: null },
  comments: { filtered: null },
};

// Function to filter rows
function filterTableCached(input, type) {
  const search = input.value.toLowerCase();
  let currentPage, cacheObj, renderFn;

  if (type === "users") {
    currentPage = usersPage;
    cacheObj = cache.users;
    renderFn = renderUsers;
  } else if (type === "posts") {
    currentPage = postsPage;
    cacheObj = cache.posts;
    renderFn = renderPosts;
  } else if (type === "comments") {
    currentPage = commentsPage;
    cacheObj = cache.comments;
    renderFn = renderComments;
  }

  const keys = Object.keys(cacheObj).filter(
    (key) => !key.includes("filtered") && key.startsWith(`${currentPage}-`),
  );
  if (!keys.length) return;

  const data = JSON.parse(JSON.stringify(cacheObj[keys[0]]));

  data.data = data.data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search),
    ),
  );

  cacheObj.filtered = data;

  renderFn(data);
}

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Attach event listeners
userSearchInput?.addEventListener(
  "input",
  debounce(() => filterTableCached(userSearchInput, "users")),
);
postSearchInput?.addEventListener(
  "input",
  debounce(() => filterTableCached(postSearchInput, "posts")),
);
commentSearchInput?.addEventListener(
  "input",
  debounce(() => filterTableCached(commentSearchInput, "comments")),
);

// Render pagination buttons
function renderPagination(containerId, page, pages, callback, filtered = null) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  let totalPages = pages;

  if (filtered) {
    totalPages = Math.ceil(filtered.data.length / LIMIT) || 1;
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.toggle("active", i === page);
    btn.addEventListener("click", () => callback(i));
    container.appendChild(btn);
  }
}

// Fetch and render Users
function renderUsers(users) {
  const tbody = document.querySelector("#users-table tbody");
  tbody.innerHTML = "";
  const fragment = document.createDocumentFragment();
  users.data.forEach((user) => {
    fragment.appendChild(createRow(user, ["name", "email", "role"], "users"));
  });
  tbody.appendChild(fragment);
  const filtered = cache.users.filtered;
  renderPagination(
    "users-pagination",
    usersPage,
    users.pages,
    loadUsers,
    filtered,
  );
}

async function loadUsers(page = usersPage) {
  usersPage = page;
  const search = userSearchInput?.value || "";
  const cacheKey = `${page}-${search}`;

  const spinner = document.getElementById("users-spinner");
  spinner.style.display = "block";

  try {
    if (cache.users[cacheKey]) {
      renderUsers(cache.users[cacheKey]);
      return;
    }

    const res = await apiFetch(
      `/api/admin/users?page=${page}&limit=${LIMIT}&search=${encodeURIComponent(search)}`,
    );
    const users = await res.json();

    cache.users[cacheKey] = users;
    renderUsers(users);
  } catch (err) {
    console.error("Failed to load users:", err);
  } finally {
    spinner.style.display = "none";
  }
}

// Fetch and render Posts
function renderPosts(posts) {
  const tbody = document.querySelector("#posts-table tbody");
  tbody.innerHTML = "";
  const fragment = document.createDocumentFragment();
  posts.data.forEach((post) => {
    fragment.appendChild(
      createRow(post, ["title", "authorName", "category"], "posts"),
    );
  });
  tbody.appendChild(fragment);

  const filtered = cache.posts.filtered;
  renderPagination(
    "posts-pagination",
    postsPage,
    posts.pages,
    loadPosts,
    filtered,
  );
}

async function loadPosts(page = postsPage) {
  postsPage = page;
  const search = postSearchInput?.value || "";
  const cacheKey = `${page}-${search}`;

  const spinner = document.getElementById("posts-spinner");
  spinner.style.display = "block";

  try {
    if (cache.posts[cacheKey]) {
      renderPosts(cache.posts[cacheKey]);
      return;
    }

    const res = await apiFetch(
      `/api/admin/posts?page=${page}&limit=${LIMIT}&search=${encodeURIComponent(search)}`,
    );
    const posts = await res.json();

    cache.posts[cacheKey] = posts;
    renderPosts(posts);
  } catch (err) {
    console.error("Failed to load posts:", err);
  } finally {
    spinner.style.display = "none";
  }
}

// Fetch and render Comments
function renderComments(comments) {
  const tbody = document.querySelector("#comments-table tbody");
  tbody.innerHTML = "";

  const fragment = document.createDocumentFragment();
  comments.data.forEach((comment) => {
    fragment.appendChild(
      createRow(comment, ["userName", "postTitle", "content"], "comments"),
    );
  });
  tbody.appendChild(fragment);

  const filtered = cache.comments.filtered;
  renderPagination(
    "comments-pagination",
    commentsPage,
    comments.pages,
    loadComments,
    filtered,
  );
}

async function loadComments(page = commentsPage) {
  commentsPage = page;
  const search = commentSearchInput?.value || "";
  const cacheKey = `${page}-${search}`;

  const spinner = document.getElementById("comments-spinner");
  spinner.style.display = "block";

  try {
    if (cache.comments[cacheKey]) {
      renderComments(cache.comments[cacheKey]);
      return;
    }

    const res = await apiFetch(
      `/api/admin/comments?page=${page}&limit=${LIMIT}&search=${encodeURIComponent(search)}`,
    );
    const comments = await res.json();

    if (!Array.isArray(comments.data)) {
      console.error("Comments data is not an array:", comments);
      return;
    }

    cache.comments[cacheKey] = comments;
    renderComments(comments);
  } catch (err) {
    console.error("Failed to load comments:", err);
  } finally {
    spinner.style.display = "none";
  }
}

// Delete functions
async function deleteUser(id, row) {
  if (!confirm("Are you sure you want to delete this user?")) return;
  try {
    const res = await apiFetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete user");

    row.remove();

    for (const key in cache.users) {
      cache.users[key].data = cache.users[key].data.filter(
        (user) => user._id !== id,
      );
    }

    showToast("User deleted successfully.", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to delete user.", "error");
  }
}

async function deletePost(id, row) {
  if (!confirm("Are you sure you want to delete this post?")) return;
  try {
    const res = await apiFetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete post");

    row.remove();

    for (const key in cache.posts) {
      cache.posts[key].data = cache.posts[key].data.filter(
        (post) => post._id !== id,
      );
    }

    showToast("Post deleted successfully.", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to delete post.", "error");
  }
}

async function deleteComment(id, row) {
  if (!confirm("Are you sure you want to delete this comment?")) return;
  try {
    const res = await apiFetch(`/api/admin/comments/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete comment");

    row.remove();

    for (const key in cache.comments) {
      cache.comments[key].data = cache.comments[key].data.filter(
        (comment) => comment._id !== id,
      );
    }

    showToast("Comment deleted successfully.", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to delete comment.", "error");
  }
}

function initNavigation() {
  const sectionFromHash = location.hash.replace("#", "") || "overview";
  showSection(sectionFromHash);
}

function initLogout() {
  logoutBtn?.addEventListener("click", () => {
    logout();
    window.location.href = "index.html";
  });
}

function renderMessage(message) {
  return `
    <div class="message-card ${message.isRead ? "read" : "unread"}" data-id="${message._id}">
      <div class="message-header">
        <strong>${message.name}</strong>
        <span>${new Date(message.createdAt).toLocaleString()}</span>
      </div>

      <p class="message-email">${message.email}</p>
      ${message.topic ? `<p class="message-topic">${message.topic}</p>` : ""}

      <p class="message-preview">
        ${message.message.slice(0, 120)}${message.message.length > 120 ? "..." : ""}
      </p>

      ${message.isRead ? "" : `<button class="mark-read-btn">Mark as read</button>`}
    </div>
  `;
}

function renderMessages(messages) {
  const container = document.getElementById("messagesList");
  container.innerHTML = "";

  messages.forEach((msg) => {
    container.insertAdjacentHTML("beforeend", renderMessage(msg));
  });

  attachMessageEvents();
}

async function loadMessages(page = messagesPage) {
  messagesPage = page;
  const spinner = document.getElementById("messages-spinner");
  const container = document.getElementById("messagesList");

  spinner.style.display = "block";
  container.innerHTML = "";
  try {
    const res = await apiFetch(
      `/api/admin/messages?page=${page}&limit=${MESSAGES_LIMIT}`,
    );
    const result = await res.json();
    messages = result?.data || [];

    if (!messages.length) {
      container.innerHTML = "<p>No messages yet.</p>";
      return;
    }

    updateUnreadCount();
    renderMessages(messages);
    attachMessageActions();

    if (result.pages) {
      renderPagination(
        "messages-pagination",
        messagesPage,
        result.pages,
        loadMessages,
      );
    }
  } catch (err) {
    showToast("Failed to load messages", "error");
  } finally {
    spinner.style.display = "none";
  }
}

function attachMessageEvents() {
  document.querySelectorAll(".message-card").forEach((card) => {
    card.addEventListener("click", async () => {
      await openMessageModalById(card.dataset.id);
    });

    const btn = card.querySelector(".mark-read-btn");
    if (btn) {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await markAsRead(card.dataset.id);
        card.classList.remove("unread");
        card.classList.add("read");
        btn.remove();
      });
    }
  });
}

async function openMessageModal(msg) {
  document.getElementById("modalTopic").textContent = msg.topic;
  document.getElementById("modalName").textContent = msg.name;
  document.getElementById("modalEmail").textContent = msg.email;
  document.getElementById("modalDate").textContent = new Date(
    msg.createdAt,
  ).toLocaleString();
  document.getElementById("modalMessage").textContent = msg.message;

  document.getElementById("messageModal").classList.remove("hidden");

  if (!msg.isRead) {
    await markAsRead(msg._id);
    msg.isRead = true;
  }
}

async function openMessageModalById(id) {
  const msg = messages.find((m) => m._id === id);
  if (!msg) return;

  await openMessageModal(msg);
}

document.getElementById("closeMessageModal").onclick = () => {
  document.getElementById("messageModal").classList.add("hidden");
};

async function markAsRead(id) {
  try {
    await apiFetch(`/api/admin/messages/${id}/read`, {
      method: "PATCH",
    });

    const msg = messages.find((m) => m._id === id);
    if (msg) msg.isRead = true;

    updateUnreadCount();
  } catch {
    showToast("Failed to update message", "error");
  }
}

function updateUnreadCount() {
  const badge = document.getElementById("unreadCount");
  if (!badge || !Array.isArray(messages)) return;

  const unread = messages.filter((m) => !m.isRead).length;

  markAllBtn.disabled = unread === 0;

  if (unread > 0) {
    badge.textContent = unread;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

function attachMessageActions() {
  document.querySelectorAll(".delete-message-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const card = e.target.closest(".message-card");
      const id = card.dataset.id;

      if (!confirm("Delete this message?")) return;

      try {
        const res = await apiFetch(`/api/admin/messages/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Delete failed");

        showToast("Message deleted", "success");
        card.remove();
        updateUnreadCount();
      } catch {
        showToast("Failed to delete message", "error");
      }
    });
  });
}

const markAllBtn = document.getElementById("markAllReadBtn");

markAllBtn?.addEventListener("click", async () => {
  try {
    const res = await apiFetch("/api/admin/messages/mark-all-read", {
      method: "PATCH",
    });

    if (!res.ok) throw new Error();

    messages.forEach((msg) => (msg.isRead = true));

    document.querySelectorAll(".message-card").forEach((card) => {
      card.classList.remove("unread");
      card.classList.add("read");
    });

    showToast("All messages marked as read", "success");
    updateUnreadCount();
  } catch (err) {
    showToast("Failed to update messages", "error");
  }
});

window.addEventListener("hashchange", initNavigation);

document.addEventListener("DOMContentLoaded", async () => {
  await checkAdmin();
  updateAvatar(window.currentUser);
  initLogout();
  loadOverviewStats();
  loadUsers(usersPage);
  loadPosts(postsPage);
  loadComments(commentsPage);
  loadMessages(messagesPage);
  initNavigation();
});
