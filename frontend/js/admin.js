import { apiFetch } from './api.js';
import { showToast } from './ui.js';
import { logout } from './auth.js';
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
  alert('Access denied. Admins only.');
  window.location.href = '/index.html';
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

const LIMIT = 10;

// Select sidebar links and sections
const sidebarLinks = document.querySelectorAll('.sidebar .admin-nav-links a');
const sections = {
  overview: document.querySelector('.overview-cards'),
  users: document.getElementById('users-section'),
  posts: document.getElementById('posts-section'),
  comments: document.getElementById('comments-section'),
  settings: document.getElementById('settings-section')
};

function showSection(sectionKey) {
  Object.values(sections).forEach(sec => {
    if (sec) sec.style.display = 'none';
  });

  sidebarLinks.forEach(link => link.classList.remove('active'));

  const section = sections[sectionKey];
  if (section) {
    section.style.display = sectionKey === 'overview' ? 'flex' : 'block';
  }

  const activeLink = document.querySelector(
    `.sidebar a[data-section="${sectionKey}"]`
  );
  activeLink?.classList.add('active');

  if (sectionKey === 'users') loadUsers();
  if (sectionKey === 'posts') loadPosts();
  if (sectionKey === 'comments') loadComments();
}

sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    location.hash = section;
    showSection(section);
  });     
});


function createRow(data, columns, type) {
  const tr = document.createElement('tr');

  columns.forEach(col => {
    const td = document.createElement('td');
    td.textContent = data[col] !== undefined && data[col] !== null ? data[col] : '';
    tr.appendChild(td);
  });

  // Actions column
  const actionTd = document.createElement('td');

  if (type === 'users') {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('btn-delete');
    deleteBtn.onclick = () => deleteUser(data._id, tr);
    actionTd.appendChild(deleteBtn);
  } else if (type === 'posts') {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('btn-delete');
    deleteBtn.onclick = () => deletePost(data._id, tr);
    actionTd.appendChild(deleteBtn);
  } else if (type === 'comments') {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('btn-delete');
    deleteBtn.onclick = () => deleteComment(data._id, tr);
    actionTd.appendChild(deleteBtn);
  }

  tr.appendChild(actionTd);
  return tr;
}

// Search inputs
const userSearchInput = document.getElementById('user-search');
const postSearchInput = document.getElementById('post-search');
const commentSearchInput = document.getElementById('comment-search');

// Function to filter rows
function filterTable(input, tableId) {
  const filter = input.value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(row => {
    row.style.display = [...row.cells]
      .some(cell => cell.textContent.toLowerCase().includes(filter))
      ? ''
      : 'none';
  });
}

// Attach event listeners
userSearchInput?.addEventListener('input', () => filterTable(userSearchInput, 'users-table'));
postSearchInput?.addEventListener('input', () => filterTable(postSearchInput, 'posts-table'));
commentSearchInput?.addEventListener('input', () => filterTable(commentSearchInput, 'comments-table'));

// Render pagination buttons
function renderPagination(containerId, page, pages, callback) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.toggle('active', i === page);
    btn.addEventListener('click', () => callback(i));
    container.appendChild(btn);
  }
}

// Fetch and render Overview Stats
async function loadOverviewStats() {
  const res = await apiFetch('/api/admin/stats');

  const data = await res.json();

  document.getElementById('total-users').textContent = data.users;
  document.getElementById('total-posts').textContent = data.posts;
  document.getElementById('total-comments').textContent = data.comments;
}


// Fetch and render Users
async function loadUsers(page = usersPage) {
  usersPage = page;
  const search = userSearchInput?.value || '';
  const res = await apiFetch(`/api/admin/users?page=${page}&limit=${LIMIT}&search=${encodeURIComponent(search)}`);
  const users = await res.json();
  const tbody = document.querySelector('#users-table tbody');
  tbody.innerHTML = '';
  users.data.forEach(user => {
    tbody.appendChild(createRow(user, ['name', 'email', 'role'], 'users'));
  });

  renderPagination('users-pagination', users.page, users.pages, loadUsers);
}

// Fetch and render Posts
async function loadPosts(page = postsPage) {
  postsPage = page;
  const search = postSearchInput?.value || '';
  const res = await apiFetch(`/api/admin/posts?page=${page}&limit=${LIMIT}&search=${encodeURIComponent(search)}`);
  const posts = await res.json();
  const tbody = document.querySelector('#posts-table tbody');
  tbody.innerHTML = '';
  posts.data.forEach(post => {
    tbody.appendChild(createRow(post, ['title', 'authorName', 'category'], 'posts'));
  });

  renderPagination('posts-pagination', posts.page, posts.pages, loadPosts);
}

// Fetch and render Comments
async function loadComments(page = commentsPage) {
  commentsPage = page;
  const search = commentSearchInput?.value || '';
  const res = await apiFetch(`/api/admin/comments?page=${page}&limit=${LIMIT}&search=${encodeURIComponent(search)}`);
  const comments = await res.json();
  const tbody = document.querySelector('#comments-table tbody');
  tbody.innerHTML = '';

  if (!Array.isArray(comments.data)) {
    console.error('Comments data is not an array:', comments);
    return;
  };

  comments.data.forEach(comment => {
    tbody.appendChild(createRow(comment, ['userName', 'postTitle', 'content'], 'comments'));
  });

  renderPagination('comments-pagination', comments.page, comments.pages, loadComments);
}

// Delete functions
async function deleteUser(id, row) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  await apiFetch(`/api/admin/users/${id}`, { 
    method: 'DELETE'
  });
  showToast('User deleted successfully.', 'success');
  loadUsers(usersPage);
}

async function deletePost(id, row) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  await apiFetch(`/api/admin/posts/${id}`, { 
    method: 'DELETE'
  });
  showToast('Post deleted successfully.', 'success');
  loadPosts(postsPage);
}

async function deleteComment(id, row) {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  await apiFetch(`/api/admin/comments/${id}`, { 
    method: 'DELETE'
  });
  showToast('Comment deleted successfully.', 'success');
  loadComments(commentsPage);
}

function initNavigation() {
  const sectionFromHash = location.hash.replace('#', '') || 'overview';
  showSection(sectionFromHash);
}

function initLogout() {
  logoutBtn?.addEventListener("click", () => {
    logout();
    window.location.href = "index.html";
  });
}

window.addEventListener('hashchange', initNavigation);

document.addEventListener("DOMContentLoaded", async () => {
  await checkAdmin();
  updateAvatar(window.currentUser);
  initLogout();
  loadOverviewStats();
  loadUsers(usersPage);
  loadPosts(postsPage);
  loadComments(commentsPage);
  initNavigation();
});


