import { handleLike } from "./likes.js";
import { toggleComments, handleDeleteComment } from "./comments.js";
import { editPost, deletePost } from "./posts.js";
import { userMenuDetails, userIcon, mobileMenu } from "./ui.js";

let isLikesModalOpen = false;

function openLikesModal(postId, users) {
  const modal = document.getElementById(`likesModal-${postId}`);
  const list = document.getElementById(`likesList-${postId}`);
  if (!modal || !list) return;

  list.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    list.appendChild(li);
  });

  modal.classList.remove("hidden");
  requestAnimationFrame(() => modal.classList.add("active"));
  isLikesModalOpen = true;

  modal
    .querySelector(".likes-modal-content")
    .addEventListener("click", (e) => e.stopPropagation());

  const closeBtn = document.getElementById(`closeLikesModal-${postId}`);
  closeBtn?.addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
      closeLikesModal(postId);
    },
    { once: true },
  );
}

function closeLikesModal(postId) {
  const modal = document.getElementById(`likesModal-${postId}`);
  if (!modal) return;
  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.add("hidden");
    isLikesModalOpen = false;
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

    // Open likes modal
    const likesInfo = e.target.closest(".likes-info");
    if (likesInfo && !likesInfo.classList.contains("disabled")) {
      e.preventDefault();
      e.stopPropagation();

      const postId = likesInfo.dataset.postId;
      const likedBy = JSON.parse(likesInfo.dataset.likedBy || "[]");
      if (!postId || likedBy.length === 0) return;

      openLikesModal(postId, likedBy);
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
