import {
  fetchPosts,
  fetchMyPosts,
  fetchTrendingPosts,
  loadSavedPosts,
  loadSinglePost,
  refreshPage,
  initPostForm,
  currentPage,
  currentSearch,
  currentCategory,
  getPageFromUrl,
} from "./posts.js";
import { initEvents } from "./events.js";
import { initAuth, checkUser } from "./auth.js";
import { initUI, applyTheme, loadSavedTheme } from "./ui.js";
import { initComments } from "./comments.js";

document
  .getElementById("canonicalUrl")
  ?.setAttribute("href", window.location.href);

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function restoreScroll() {
  const key = `scroll:${window.location.pathname}${window.location.search}`;
  const savedScroll = sessionStorage.getItem(key);

  if (savedScroll !== null) {
    window.scrollTo(0, Number(savedScroll));
    sessionStorage.removeItem(key);
  }
}

async function routeByPage() {
  const path = window.location.pathname;

  if (path === "/" || path.endsWith("index.html")) {
    await fetchPosts(getPageFromUrl());
    await fetchTrendingPosts();
  } else if (path.endsWith("my-posts.html")) {
    await fetchMyPosts(getPageFromUrl());
  } else if (path.endsWith("post.html")) {
    await loadSinglePost();
  } else if (path.endsWith("saved.html")) {
    await loadSavedPosts(getPageFromUrl());
  } else if (path.startsWith("/post/")) {
    loadSinglePost();
  } else {
    await fetchPosts(getPageFromUrl());
  }

  restoreScroll();
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (!link) return;

  const url = new URL(link.href, window.location.origin);

  if (url.origin !== window.location.origin) return;

  const key = `scroll:${window.location.pathname}${window.location.search}`;
  sessionStorage.setItem(key, window.scrollY);

  if (typeof currentPage !== "undefined") {
    sessionStorage.setItem("postsPage", currentPage);
  }

  if (typeof currentCategory !== "undefined") {
    sessionStorage.setItem("postsCategory", currentCategory);
  }

  if (typeof currentSearch !== "undefined") {
    sessionStorage.setItem("postsSearch", currentSearch);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const user = await checkUser();
  window.currentUser = user;

  initAuth();
  initUI();
  initEvents();
  initComments();
  loadSavedTheme();

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  await routeByPage();

  if (
    window.location.pathname.endsWith("write.html") &&
    !localStorage.getItem("editSlug")
  ) {
    localStorage.removeItem("editSlug");
  }

  if (!window.location.pathname.endsWith("post.html")) {
    refreshPage();
  }

  initPostForm();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
    initUI();
  }
});
