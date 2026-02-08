import {
  fetchPosts,
  fetchFeaturedPosts,
  fetchMyPosts,
  fetchTrendingPosts,
  loadSavedPosts,
  loadSinglePost,
  initPostForm,
  getStateFromUrl,
  restoreFiltersFromUrl,
} from "./posts.js";
import { initEvents } from "./events.js";
import { initAuth, checkUser } from "./auth.js";
import { initUI, applyTheme, loadSavedTheme, showSkeleton, initUserMenu } from "./ui.js";
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

export async function routeByPage() {
  const path = window.location.pathname;
  const { page } = getStateFromUrl();

  if (path === "/" || path.endsWith("index.html")) {
    restoreFiltersFromUrl();
    showSkeleton("featuredPostsContainer", 3);
    await fetchFeaturedPosts();
    await fetchPosts(page);
    await fetchTrendingPosts();
  } else if (path.endsWith("my-posts.html")) {
    restoreFiltersFromUrl();
    showSkeleton("myPostsContainer", 6);
    await fetchMyPosts(page);
  } else if (path.endsWith("post.html")) {
    await loadSinglePost();
  } else if (path.endsWith("saved.html")) {
    restoreFiltersFromUrl();
    showSkeleton("savedPostsContainer", 6);
    await loadSavedPosts(page);
  } else if (path.startsWith("/post/")) {
    loadSinglePost();
  } else {
    restoreFiltersFromUrl();
    showSkeleton();
    await fetchPosts(page);
  }

  restoreScroll();
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = await checkUser();
  window.currentUser = user;

  initAuth();
  initUI();
  initEvents();
  initComments();
  loadSavedTheme();
  initUserMenu();

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  await routeByPage();

  if (
    window.location.pathname.endsWith("write.html") &&
    !localStorage.getItem("editSlug")
  ) {
    localStorage.removeItem("editSlug");
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

window.addEventListener("popstate", () => {
  routeByPage();
});
