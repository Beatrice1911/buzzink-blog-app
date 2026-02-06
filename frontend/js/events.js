import { handleLike } from "./likes.js";
import { toggleComments, handleDeleteComment } from "./comments.js";
import { handleShare } from "./share.js";
import { editPost, deletePost } from "./posts.js";
import { userMenuDetails, userIcon, mobileMenu, menuToggle } from "./ui.js";

let isLikesModalOpen = false;

function openLikesModal(postSlug, users) {
  if (isLikesModalOpen) return;
  const safeSlug = encodeURIComponent(postSlug);
  const modal = document.getElementById(`likesModal-${safeSlug}`);
  const list = document.getElementById(`likesList-${safeSlug}`);
  if (!modal || !list) return;

  list.innerHTML = "";
  if (!Array.isArray(users) || users.length === 0) return;
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    list.appendChild(li);
  });

  modal.classList.remove("hidden");
  requestAnimationFrame(() => modal.classList.add("active"));
  isLikesModalOpen = true;

  const content = modal.querySelector(".likes-modal-content");

  if (content && !content.dataset.bound) {
    content?.addEventListener("click", (e) => e.stopPropagation());
    content.dataset.bound = "true";
  }

  const closeBtn = document.getElementById(`closeLikesModal-${safeSlug}`);

  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLikesModal(postSlug);
    });
    closeBtn.dataset.bound = "true";
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
      const likedBy = JSON.parse(likesInfo.dataset.likedBy || "[]");
      if (!postSlug || likedBy.length === 0) return;

      openLikesModal(postSlug, likedBy);
      return;
    }

    if (isLikesModalOpen) {
      const openModal = document.querySelector(".likes-modal.active");
      if (openModal && !openModal.contains(e.target)) {
        const modalId = openModal.id.replace("likesModal-", "");
        closeLikesModal(modalId);
      }
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
      ![...userIcon].some((icon) => icon.contains(e.target))
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
  });
}
