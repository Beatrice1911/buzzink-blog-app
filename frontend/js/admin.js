const role = localStorage.getItem('role');
async function checkAdmin() {
  const token = localStorage.getItem('token');
  if (!token) return redirectHome();

  const res = await fetch('/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const user = await res.json();

  if (!user || user.role !== 'admin') return redirectHome();
}

function redirectHome() {
  alert('Access denied. Admins only.');
  window.location.href = '/index.html';
}

checkAdmin();

// Select sidebar links and sections
const sidebarLinks = document.querySelectorAll('.sidebar .nav-links a');
const sections = {
  Overview: document.querySelector('.overview-cards'),
  Users: document.getElementById('users-section'),
  Posts: document.getElementById('posts-section'),
  Comments: document.getElementById('comments-section'),
  Settings: null
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
    td.textContent = data[col] || '';
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

// Fetch and render Users
async function loadUsers() {
  const res = await fetch('/api/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const users = await res.json();
  const tbody = document.querySelector('#users-table tbody');
  tbody.innerHTML = '';
  users.forEach(user => {
    tbody.appendChild(createRow(user, ['name', 'email', 'role'], 'users'));
  });
}

// Fetch and render Posts
async function loadPosts() {
  const res = await fetch('/api/admin/posts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const posts = await res.json();
  const tbody = document.querySelector('#posts-table tbody');
  tbody.innerHTML = '';
  posts.forEach(post => {
    tbody.appendChild(createRow(post, ['title', 'authorName', 'category'], 'posts'));
  });
}

// Fetch and render Comments
async function loadComments() {
  const res = await fetch('/api/admin/comments', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const comments = await res.json();
  const tbody = document.querySelector('#comments-table tbody');
  tbody.innerHTML = '';
  comments.forEach(comment => {
    tbody.appendChild(createRow(comment, ['userName', 'postTitle', 'content'], 'comments'));
  });
}

// Initial load
loadUsers();
loadPosts();
loadComments();

const token = localStorage.getItem('token');

// Delete functions
async function deleteUser(id, row) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  await fetch(`/api/admin/users/${id}`, { 
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  loadUsers();
}

async function deletePost(id, row) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  await fetch(`/api/admin/posts/${id}`, { 
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  loadPosts();
}

async function deleteComment(id, row) {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  await fetch(`/api/admin/comments/${id}`, { 
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  loadComments();
}

