import { registerForm, loginForm } from "./auth";
import { body } from "./config";

export const userIcon = document.querySelectorAll(".user-icon");
export const userMenuDetails = document.getElementById("userMenuDetails");
const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const writePostBtns = document.querySelectorAll(".write-post");
const searchIcon = document.querySelector(".search-icon");
const mobileSearch = document.getElementById("mobileSearch");
export const menuToggle = document.querySelector(".menu-toggle");
export const mobileMenu = document.getElementById("mobileMenu");
const logo = document.querySelector(".logo");
const allPostsBtn = document.querySelector(".all-posts-btn");
const myPosts = document.getElementById("myPosts");
const savedPosts = document.getElementById("savedPosts");
const profileEdit = document.getElementById("profile-edit");
const settings = document.getElementById("settings");
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

export function showToast(message, type = "info", duration = 5000) {
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
    toast?.addEventListener("animationend", () => toast.remove());
  }, duration);
}

function initMenus() {
  menuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (userMenuDetails.classList.contains("show")) {
      userMenuDetails.classList.remove("show");
    }
    mobileMenu.classList.toggle("active");
  });
}

function initNavigation() {
  logo?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  allPostsBtn?.addEventListener("click", () => {
    window.location.href = "all-posts.html";
  });

  myPosts?.addEventListener("click", () => {
    window.location.href = "my-posts.html";
  });

  profileEdit?.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

  savedPosts?.addEventListener("click", () => {
    window.location.href = "saved.html";
  });

  settings?.addEventListener("click", () => {
    window.location.href = "settings.html";
  });
}

function initAuthModal() {
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
  closeModal?.addEventListener("click", () => {
    authModal.classList.add("hidden");
  });
}

function initUserMenu() {
  userIcon.forEach((icon) =>
    icon?.addEventListener("click", () => {
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
    }),
  );
}

function initSearchToggle() {
  searchIcon?.addEventListener("click", () => {
    mobileSearch.classList.toggle("show");
    if (mobileSearch.classList.contains("show")) {
      mobileSearch.querySelector("input").focus();
    }
  });
}

function initWritePostButtons() {
  writePostBtns.forEach((btn) => {
    btn?.addEventListener("click", (e) => {
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
}

function initTheme() {
  themeToggle?.addEventListener("change", () => {
    if (themeToggle.checked) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      logo.src = "/Images/logo-dark-theme_optimized_.png";
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      logo.src = "/Images/logo_optimized.png";
    }
  });
}

export function loadSavedTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.checked = true;
  } else {
    root.setAttribute("data-theme", "light");
  }
}

export function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    logo.src = "/Images/logo-dark-theme_optimized_.png";
  } else {
    body.classList.remove("dark");
    logo.src = "/Images/logo_optimized.png";
  }

  localStorage.setItem("theme", theme);
}

export function initUI() {
  initMenus();
  initAuthModal();
  initUserMenu();
  initSearchToggle();
  initWritePostButtons();
  initNavigation();
  initTheme();
}
