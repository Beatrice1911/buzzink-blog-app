import { apiFetch } from "./api.js";
import { COMMENTS_URL } from "./config.js";
import { showToast } from "./ui.js";
import { formatText, timeAgo } from "./posts.js";

const path = window.location.pathname;

export async function toggleComments(commentBtn) {
  const slug = commentBtn.dataset.slug;

  if (!slug) return;

  const isSinglePost = path.endsWith("post.html") || path.startsWith("/post/");

  const postElement = isSinglePost
    ? document.getElementById("singlePostContainer")
    : commentBtn.closest(".post");
  if (!postElement) return;

  const commentsSection = postElement.querySelector(".comments-section");
  const commentsList = commentsSection?.querySelector(".comments-list");

  if (!commentsSection || !commentsList) return;

  if (!isSinglePost) {
    commentsSection.classList.toggle("show");
  }

  if (isSinglePost || commentsSection.classList.contains("show")) {
    await fetchComments(slug, commentsList);
  }
}

// Delete comment handler
export async function handleDeleteComment(deleteBtn) {
  if (deleteBtn.dataset.deleting === "true") return;
  deleteBtn.dataset.deleting = "true";
  const commentId = deleteBtn.dataset.commentId;
  const confirmDelete = confirm(
    "Are you sure you want to delete this comment?",
  );
  if (!confirmDelete) {
    deleteBtn.dataset.deleting = "false";
    return;
  }

  try {
    const res = await apiFetch(`${COMMENTS_URL}/${commentId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      const commentEl = deleteBtn.closest(".comment");
      if (commentEl) commentEl.remove();

      const postElement = path.endsWith("post.html") || path.startsWith("/post/")
        ? document.getElementById("singlePostContainer")
        : deleteBtn.closest(".post");

      const commentCountSpan = postElement?.querySelector(".comment-count");

      if (commentCountSpan) {
        let count = parseInt(commentCountSpan.textContent) || 0;
        count = Math.max(count - 1, 0);
        commentCountSpan.textContent = count;
        commentCountSpan.title = `${count} comment${count !== 1 ? "s" : ""}`;
      }
      showToast("Comment deleted successfully!", "success");
    } else {
      throw new Error(data.message || "Delete failed");
    }
  } catch (err) {
    console.error("Error deleting comment:", err);
    showToast("Error deleting comment. Please try again.", "error");
  } finally {
    deleteBtn.dataset.deleting = "false";
  }
}

export async function fetchComments(slug, commentsList, limit = 3) {
  try {
    commentsList.innerHTML = `<p class="loading-comments">Loading comments...</p>`;

    const res = await apiFetch(`${COMMENTS_URL}/post/${slug}?_=${Date.now()}`);
    if (!res.ok) throw new Error("Failed to fetch comments");

    const comments = await res.json();

    commentsList.innerHTML = "";

    if (comments.length === 0) {
      commentsList.innerHTML =
        "<p class='no-comments'>No comments yet. Be the first to comment!</p>";
      return;
    }

    const limitedComments = comments.slice(0, limit);
    renderComments(limitedComments, commentsList);

    if (comments.length > limit) {
      const toggleBtn = document.createElement("button");
      toggleBtn.classList.add("view-more-btn");
      toggleBtn.textContent = `View all ${comments.length} comments`;

      const fullContainer = document.createElement("div");
      fullContainer.classList.add("comments-scroll-container");
      fullContainer.style.display = "none";
      renderComments(comments, fullContainer);

      let expanded = false;

      toggleBtn?.addEventListener("click", () => {
        expanded = !expanded;
        if (expanded) {
          commentsList.innerHTML = "";
          commentsList.appendChild(fullContainer);
          commentsList.appendChild(toggleBtn);
          fullContainer.style.display = "block";
          toggleBtn.textContent = "View less comments";
        } else {
          commentsList.innerHTML = "";
          renderComments(limitedComments, commentsList);
          toggleBtn.textContent = `View all ${comments.length} comments`;
          commentsList.appendChild(toggleBtn);
        }
      });
      commentsList.appendChild(toggleBtn);
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
    commentsList.innerHTML =
      "<p class='error-comments'>Failed to load comments.</p>";
  }
}

export function renderComments(comments, commentsList) {
  const currentUserId = window.currentUser?.id || window.currentUser?._id;
  comments.forEach((comment) => {
    const div = document.createElement("div");
    div.classList.add("comment");

    const commentAuthorId =
      typeof comment.authorId === "object"
        ? comment.authorId._id
        : comment.authorId;

    const isOwner =
      currentUserId &&
      commentAuthorId &&
      commentAuthorId.toString() === currentUserId.toString();

    div.innerHTML = `
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${comment.authorId?.name || "Anonymous"}:</strong> ${formatText(comment.text)}</p>
        ${
          isOwner
            ? `<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${comment._id}">Delete</button>
                  </div>
                </div>`
            : ""
        }
      </div>  
      <small title="${new Date(comment.createdAt).toLocaleString()}">
        ${timeAgo(comment.createdAt)}
      </small>
    `;
    commentsList.appendChild(div);

    const commentAuthor = div.querySelector(".comment-author");
    commentAuthor?.addEventListener("click", () => {
      window.location.href = `profile.html?id=${comment.authorId?._id}`;
    });
  });
}

export async function postComment(slug, text, commentsList, commentCountSpan) {
  try {
    const res = await apiFetch(`${COMMENTS_URL}/post/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const data = await res.json();
      const newComment = data.comment;
      const div = document.createElement("div");
      div.classList.add("comment");
      div.innerHTML = `
        <div class="comment-header">
          <p><strong>You:</strong> ${formatText(newComment.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${newComment._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(newComment.createdAt).toLocaleString()}">
        ${timeAgo(newComment.createdAt)}
      </small>
      `;
      commentsList.prepend(div);
      if (commentCountSpan) {
        if (commentCountSpan) {
          let count = parseInt(commentCountSpan.textContent) || 0;
          commentCountSpan.textContent = count + 1;
          commentCountSpan.title = `${count + 1} comments`;
        }
      }

      showToast("Comment posted successfully!", "success");
    } else {
      throw new Error("Failed to post comment");
    }
  } catch (err) {
    console.error("Error posting comment:", err);
    showToast("Failed to post comment", "error");
  }
}

// Update comment count for a post
export async function updateCommentCount(slug, commentCountSpan) {
  try {
    const res = await apiFetch(`${COMMENTS_URL}/post/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch comment count");

    const comments = await res.json();
    const count = comments.length;

    if (count === 0) {
      commentCountSpan.textContent = "0";
      commentCountSpan.title = "No comments yet";
    } else {
      commentCountSpan.textContent = count;
      commentCountSpan.title = `${count} comment${count > 1 ? "s" : ""}`;
    }
  } catch (err) {
    console.error("Error fetching comment count:", err);
    commentCountSpan.textContent = "0";
  }
}

async function handleCommentSubmit(e) {
  const commentForm = e.target.closest(".comment-form");
  if (!commentForm) return;

  const addCommentBtn = commentForm.querySelector("button");
  if (!addCommentBtn) return;
  e.preventDefault();

  const commentInput = commentForm.querySelector(".comment-input");
  const commentText = commentInput.value.trim();
  if (!commentText) return;

  let postElement;
  let commentsList;
  let slug;
  let commentCountSpan;

  if (path.endsWith("post.html") || path.startsWith("/post/")) {
    postElement = document.getElementById("singlePostContainer");
    commentsList = postElement.querySelector(".comments-list");
    slug = postElement.querySelector(".comment-btn").dataset.slug;
    commentCountSpan = postElement.querySelector(".comment-count");
  } else {
    postElement = commentForm.closest(".post");
    commentsList = postElement.querySelector(".comments-list");
    slug = postElement.querySelector(".like-btn").dataset.slug;
    commentCountSpan = postElement.querySelector(".comment-count");
  }

  const setPostingState = (isPosting) => {
    addCommentBtn.disabled = isPosting;
    addCommentBtn.innerHTML = isPosting
      ? `<i class="fa-solid fa-spinner fa-spin"></i>`
      : "Comment";
  };

  try {
    setPostingState(true);
    if (!window.currentUser) {
      showToast("Please log in to comment.", "error");
      commentInput.value = "";
      setPostingState(false);
      return;
    }

    await postComment(slug, commentText, commentsList, commentCountSpan);
    commentInput.value = "";
  } catch (err) {
    console.error(err);
  } finally {
    setPostingState(false);
  }
}

export function initComments() {
  document.addEventListener("submit", handleCommentSubmit);
}
