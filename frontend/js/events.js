import { handleLike } from "./likes.js";
import { toggleComments, handleDeleteComment } from "./comments.js";
import { handleShare } from "./share.js";
import { editPost, deletePost } from "./posts.js";
import {
  userMenuDetails,
  mobileMenu,
  menuToggle,
  authModal,
  loginTab,
  registerTab,
} from "./ui.js";
import { apiFetch } from "./api.js";
import { loginForm, registerForm } from "./auth.js";

const modal = document.getElementById("likesModal");
const list = document.getElementById("likesList");

let activeLikesSlug = null;

async function openLikesModal(postSlug) {
  activeLikesSlug = postSlug;

  modal.classList.remove("hidden");
  requestAnimationFrame(() => modal.classList.add("active"));

  list.innerHTML = "<li>Loading...</li>";

  try {
    const res = await apiFetch(`/api/posts/${postSlug}/likes`);
    const data = await res.json();

    if (activeLikesSlug !== postSlug) return;

    list.innerHTML = "";

    if (!Array.isArray(data.users) || data.users.length === 0) {
      list.innerHTML = "<li>No likes yet</li>";
      return;
    }

    data.users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user;
      list.appendChild(li);
    });
  } catch (err) {
    if (activeLikesSlug === postSlug) {
      list.innerHTML = "<li>Failed to load likes</li>";
    }
    console.error("Failed to fetch likes:", err);
  }
}

function closeLikesModal() {
  activeLikesSlug = null;
  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.add("hidden");
    list.innerHTML = "";
  }, 300);
}

export function initEvents() {
  document.addEventListener("click", async (e) => {
    // Edit post handling
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();
      editPost(editBtn.dataset.slug);
      return;
    }

    // Delete post handling
    const deletePostBtn = e.target.closest(".delete-btn");
    if (deletePostBtn) {
      e.preventDefault();
      e.stopPropagation();
      deletePost(deletePostBtn.dataset.slug);
      return;
    }

    // Like button handling
    const likeBtn = e.target.closest(".like-btn");
    if (likeBtn) {
      e.preventDefault();
      handleLike(likeBtn);
      return;
    }

    // Comment button handling
    const commentBtn = e.target.closest(".comment-btn");
    if (commentBtn) {
      e.preventDefault();
      toggleComments(commentBtn);
      return;
    }

    // Share button handling
    const sharebtn = e.target.closest(".share-btn");
    if (sharebtn) {
      e.preventDefault();
      handleShare(sharebtn);
      return;
    }

    // Open likes modal
    const likesInfo = e.target.closest(".likes-info");
    if (likesInfo && !likesInfo.classList.contains("disabled")) {
      e.preventDefault();
      e.stopPropagation();

      const postSlug = likesInfo.dataset.slug;
      if (!postSlug) return;

      openLikesModal(postSlug);
      return;
    }

    if (e.target === modal) {
      closeLikesModal();
    }

    // Delete comment handling
    const deleteCommentBtn = e.target.closest(".delete-comment-btn");
    if (deleteCommentBtn) {
      e.preventDefault();
      e.stopPropagation();
      handleDeleteComment(deleteCommentBtn);
    }

    // Menu button handling
    const commentMenuBtn = e.target.closest(".menu-btn");
    const commentOptions = e.target.closest(".menu-options");

    // Close all menus if clicking elsewhere
    if (!commentMenuBtn && !commentOptions) {
      document
        .querySelectorAll(".menu-options")
        .forEach((opt) => opt.classList.add("hidden"));
    }

    if (commentMenuBtn) {
      const menu = commentMenuBtn.nextElementSibling;
      menu.classList.toggle("hidden");
    }

    // Handle user menu
    if (
      userMenuDetails?.classList.contains("show") &&
      !userMenuDetails.contains(e.target) &&
      !e.target.closest(".user-icon")
    ) {
      userMenuDetails.classList.remove("show");
    }

    // Handle mobile menu
    if (
      mobileMenu?.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      mobileMenu.classList.remove("active");
    }

    const icon = e.target.closest(".user-icon");
    if (!icon) return;
    e.stopPropagation();

    const user = window.currentUser;

    if (user && (user.id || user._id)) {
      userMenuDetails.classList.toggle("show");
      authModal.classList.add("hidden");
    } else {
      userMenuDetails.classList.remove("show");
      authModal.classList.remove("hidden");

      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeLikesModal();
  }
});
