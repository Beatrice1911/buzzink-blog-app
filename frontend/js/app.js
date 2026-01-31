import { setUpPostSEO } from "./seo.js";
import {
  fetchPosts,
  fetchMyPosts,
  fetchTrendingPosts,
  loadSavedPosts,
  loadSinglePost,
  refreshPage,
  initPostForm,
} from "./posts.js";
import { initEvents } from "./events.js";
import { initAuth, checkUser, updateAvatar } from "./auth.js";
import { initUI, applyTheme, loadSavedTheme } from "./ui.js";
import { initComments } from "./comments.js";

document
  .getElementById("canonicalUrl")
  ?.setAttribute("href", window.location.href);

function routeByPage() {
  const path = window.location.pathname;

  if (path === "/" || path.endsWith("index.html")) {
    fetchPosts();
    fetchTrendingPosts();
  } else if (path.endsWith("my-posts.html")) {
    fetchMyPosts();
  } else if (path.endsWith("post.html")) {
    loadSinglePost();
  } else if (path.endsWith("saved.html")) {
    loadSavedPosts();
  } else {
    fetchPosts();
  }
}

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

  if (
    window.location.pathname.endsWith("write.html") &&
    !localStorage.getItem("editSlug")
  ) {
    localStorage.removeItem("editSlug");
  }

  initPostForm();
});
