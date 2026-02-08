import { handleLike } from "./likes.js";
import { toggleComments, handleDeleteComment } from "./comments.js";
import { handleShare } from "./share.js";
import { editPost, deletePost } from "./posts.js";
import {
  userMenuDetails,
  userIcon,
  mobileMenu,
  menuToggle,
  authModal,
  registerTab,
  loginTab,
} from "./ui.js";
import { apiFetch } from "./api.js";
import { registerForm, loginForm } from "./auth.js";

let isLikesModalOpen = false;

async function openLikesModal(postSlug) {
  if (isLikesModalOpen) return;
  const safeSlug = encodeURIComponent(postSlug);
  const modal = document.getElementById(`likesModal-${safeSlug}`);
  const list = document.getElementById(`likesList-${safeSlug}`);
  if (!modal || !list) return;

  if (modal.classList.contains("active")) return;

  isLikesModalOpen = true;
  modal.classList.remove("hidden");
  requestAnimationFrame(() => modal.classList.add("active"));

  list.innerHTML = "<li>Loading...</li>";

  try {
    const res = await apiFetch(`/api/posts/${postSlug}/likes`);
    const data = await res.json();

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
    list.innerHTML = "<li>Failed to load likes</li>";
    console.error("Failed to fetch likes:", err);
  }
}

function closeLikesModal(postSlug) {
  const safeSlug = encodeURIComponent(postSlug);
  const modal = document.getElementById(`likesModal-${safeSlug}`);
  if (!modal) return;

  isLikesModalOpen = false;
  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.add("hidden");
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

    const openModal = document.querySelector(".likes-modal.active");
    if (openModal && !openModal.contains(e.target)) {
      const modalId = openModal.id.replace("likesModal-", "");
      closeLikesModal(modalId);
    }

    // Delete comment handling
    const deleteCommentBtn = e.target.closest(".delete-comment-btn");
    if (deleteCommentBtn) {
      e.preventDefault();
      e.stopPropagation();
      handleDeleteComment(deleteCommentBtn);
    }

    // Menu button handling
    const comentMenuBtn = e.target.closest(".menu-btn");
    const commentOptions = e.target.closest(".menu-options");

    // Close all menus if clicking elsewhere
    if (!comentMenuBtn && !commentOptions) {
      document
        .querySelectorAll(".menu-options")
        .forEach((opt) => opt.classList.add("hidden"));
    }

    if (comentMenuBtn) {
      const menu = comentMenuBtn.nextElementSibling;
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
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user && user.id) {
      userMenuDetails.classList.toggle("show");
      userMenuDetails?.addEventListener("click", (e) => e.stopPropagation());
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
  });
}
