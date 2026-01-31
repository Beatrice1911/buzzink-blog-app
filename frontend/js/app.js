import { setUpPostSEO } from "./seo.js";
import {
  fetchPosts,
  fetchMyPosts,
  fetchTrendingPosts,
  loadSavedPosts,
  loadSinglePost,
  refreshPage,
} from "./posts.js";
import { initEvents } from "./events.js";
import { initAuth, checkUser, updateAvatar } from "./auth.js";
import { initUI, applyTheme, loadSavedTheme, navigate } from "./ui.js";
import { initComments } from "./comments.js";

document
  .getElementById("canonicalUrl")
  ?.setAttribute("href", window.location.href);

function routeByPage() {
  const path = window.location.pathname;

  if (path === "/" || path === "/index") {
    fetchPosts();
    fetchTrendingPosts();
  } else if (path === "/my-posts") {
    fetchMyPosts();
  } else if (path === "/post") {
    loadSinglePost();
  } else if (path === "/saved") {
    loadSavedPosts();
  } else {
    fetchPosts();
  }
}

document?.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-link]");
  if (!link) return;

  e.preventDefault();
  navigate(link.getAttribute("href"));
});

document.addEventListener("DOMContentLoaded", async () => {
  const user = await checkUser();
  window.currentUser = user;

  await updateAvatar(user);

  setUpPostSEO();
  initEvents();
  initAuth();
  initUI();
  initComments();
  loadSavedTheme();

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  routeByPage();
  refreshPage();
});

window.addEventListener("popstate", routeByPage);
