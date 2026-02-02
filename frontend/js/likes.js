import { apiFetch } from "./api.js";
import { showToast } from "./ui.js";

export async function handleLike(btn) {
  const postId = btn.dataset.postId;
  const heart = btn.querySelector("i");
  const countEl = btn.querySelector(".like-count");
  const likedByEl = btn
    .closest(".post-interactions-container")
    ?.querySelector(".liked-by");

  const alreadyLiked = btn.classList.contains("liked");
  if (!window.currentUser) {
    showToast("Please log in to like or unlike posts.", "error");
    return;
  }

  try {
    let res;
    if (alreadyLiked) {
      res = await apiFetch(`/api/posts/${postId}/unlike`, {
        method: "POST",
      });
    } else {
      res = await apiFetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
    }

    const data = await res.json();

    if (res.ok) {
      if (alreadyLiked) {
        btn.classList.remove("liked");
        heart.className = "fa-regular fa-heart";
      } else {
        btn.classList.add("liked");
        heart.className = "fa-solid fa-heart";
      }

      countEl.textContent = data.likes ?? 0;

      likedByEl.dataset.postId = postId;
      likedByEl.dataset.likedBy = JSON.stringify(data.likedBy || []);

      if (data.likedBy && data.likedBy.length > 0) {
        likedByEl.classList.remove("disabled");
        if (data.likedBy.length === 1) {
          likedByEl.textContent = `Liked by ${data.likedBy[0]}`;
        } else {
          likedByEl.textContent = `Liked by ${data.likedBy[0]} and ${data.likedBy.length - 1} others`;
        }
      } else {
        likedByEl.classList.add("disabled");
        likedByEl.textContent = "No likes yet";
      }
    } else {
      showToast(`Failed to update likes: ${data.message}`, "error");
    }
  } catch (err) {
    console.error("Like action failed:", err);
    showToast("Error updating like. Please try again.", "error");
  }
}
