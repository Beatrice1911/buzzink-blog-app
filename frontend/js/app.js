import { setUpPostSEO } from "./seo.js";
import { fetchPosts, fetchMyPosts, fetchTrendingPosts, loadSavedPosts, loadSinglePost, refreshPage } from "./posts.js";
import { initEvents } from "./events.js";
import { initAuth, checkUser } from "./auth.js";
import { initUI, applyTheme, loadSavedTheme } from "./ui.js";
import { initComments } from "./comments.js";

document
  .getElementById("canonicalUrl")
  ?.setAttribute("href", window.location.href);

function routeByPage(){
if (window.location.pathname.endsWith("index.html")) {
    fetchPosts();
    fetchTrendingPosts();
  } else if (window.location.pathname.endsWith("my-posts.html")) {
    fetchMyPosts();
  } else if (window.location.pathname.endsWith("post.html")) {
    loadSinglePost();
  } else if (window.location.pathname.endsWith("saved.html")) {
    loadSavedPosts();
  } else {
    fetchPosts();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  setUpPostSEO();
  initEvents();
  initAuth();
  initUI();
  initComments();
  loadSavedTheme();

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  const user = await checkUser(); 
  window.currentUser = user;

  await updateAvatar(user);

  routeByPage
  refreshPage();
});
