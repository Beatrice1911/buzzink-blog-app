import { apiFetch } from './app.js';
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
async function checkAdmin() {
  const token = localStorage.getItem('token');
  if (!token) return redirectHome();

  const res = await apiFetch('/api/users/me');
  const user = await res.json();

  if (!user || user.role !== 'admin') return redirectHome();
}

function redirectHome() {
  alert('Access denied. Admins only.');
  window.location.href = '/index.html';
}

let usersPage = 1;
let postsPage = 1;
let commentsPage = 1;

const LIMIT = 10;


// Select sidebar links and sections
const sidebarLinks = document.querySelectorAll('.sidebar .nav-links a');
const sections = {
  Overview: document.querySelector('.overview-cards'),
  Users: document.getElementById('users-section'),
  Posts: document.getElementById('posts-section'),
  Comments: document.getElementById('comments-section'),
  Settings: document.getElementById('settings-section')
};

// Function to hide all sections
function hideAllSections() {
  Object.values(sections).forEach(section => {
    if (section) section.style.display = 'none';
  });
}

// Function to handle link clicks
sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove active class from all links
    sidebarLinks.forEach(l => l.classList.remove('active'));

    // Add active class to clicked link
    link.classList.add('active');

    const linkText = link.textContent.trim();

    hideAllSections(); // Hide everything first

    if (linkText === 'Overview') {
      sections.Overview.style.display = 'flex';
    } else if (sections[linkText]) {
      sections[linkText].style.display = 'block';
    }
  });
});

// Utility function to create a table row
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
  loadUsers(usersPage);
}

async function deletePost(id, row) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  await apiFetch(`/api/admin/posts/${id}`, { 
    method: 'DELETE'
  });
  loadPosts(postsPage);
}

async function deleteComment(id, row) {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  await apiFetch(`/api/admin/comments/${id}`, { 
    method: 'DELETE'
  });
  loadComments(commentsPage);
}

document.addEventListener("DOMContentLoaded", async () => {
  await checkAdmin();
  loadOverviewStats();
  loadUsers(usersPage);
  loadPosts(postsPage);
  loadComments(commentsPage);
});
